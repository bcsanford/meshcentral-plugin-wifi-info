// plugin.js
const pluginName = 'wifi-info';

module.exports = function (parent) {
    parent.plugin = this;
    this.parent = parent;
    this.name = pluginName;

    // Hook into the agent information update process
    parent.AddEventDispatch(['nodeconn'], (obj, rights, user) => {
        const node = parent.webserver.MeshServer.db.GetNode(obj.nodeid);
        if (!node) return;

        const os = node.osdesc || '';
        const cmd = os.includes('Windows') ? 'netsh wlan show interfaces' : 'iwgetid -r';

        parent.SendCommandToAgent({
            action: 'runCommand',
            nodeid: obj.nodeid,
            command: cmd,
            sessionid: null
        }, function (response) {
            const ssid = parseSSID(response.stdout || '');
            if (!node.wifiInfo || node.wifiInfo.ssid !== ssid) {
                node.wifiInfo = { ssid: ssid };
                parent.db.Set(node._id, node); // Save updated node info
                parent.DispatchEvent(['*'], obj.nodeid, { etype: 'nodeinfo', nodeid: obj.nodeid, wifiInfo: node.wifiInfo });
            }
        });
    });

    // Inject SSID into device details page
    parent.AddDeviceInfoHandler((req, res, node) => {
        if (node.wifiInfo && node.wifiInfo.ssid) {
            res.write(`<tr><td><b>Connected SSID:</b></td><td>${node.wifiInfo.ssid}</td></tr>`);
        }
    });

    function parseSSID(output) {
        if (!output) return null;
        const lines = output.split('\n');
        for (let line of lines) {
            if (line.toLowerCase().includes('ssid') && !line.toLowerCase().includes('bssid')) {
                return line.split(':')[1]?.trim();
            }
        }
        return output.trim(); // fallback
    }
};
