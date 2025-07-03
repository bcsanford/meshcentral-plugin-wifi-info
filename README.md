# MeshCentral WiFi Info Plugin

This MeshCentral plugin adds the connected WiFi SSID to the **Device Details** page for each connected agent. It supports both **Windows** and **Linux** systems.

## Features

- Detects and displays the currently connected SSID
- Updates on each agent connection
- Adds info inline with standard network details
- Compatible with the MeshCentral plugin system

## Supported Platforms

- ✅ Windows (via `netsh wlan show interfaces`)
- ✅ Linux (via `iwgetid -r`)

## Installation

1. Clone this repository into your MeshCentral plugin directory:

```bash
cd /path/to/meshcentral-data/plugins/
git clone https://github.com/YOUR_USERNAME/meshcentral-plugin-wifi-info.git wifi-info
```

2. In `config.json`, add:

```json
"plugins": {
  "wifi-info": {}
}
```

3. Restart MeshCentral:

```bash
sudo systemctl restart meshcentral
```

## License

MIT