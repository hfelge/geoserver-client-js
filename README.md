# GeoServer Client JS

A modern JavaScript client for the GeoServer REST API. Fully modular, testable, and Node.js-compatible.

## ✅ Features

- Workspace management
- Unified request + error handling
- Fully ESM-compatible
- `.env`-based configuration
- Vitest tests included

## 📦 Installation

```bash
npm install @hfelge/geoserver-client-js
```

## 📄 Usage Example
```bash
import { GeoServerClient, WorkspaceManager } from '@hfelge/geoserver-client-js';

const client = new GeoServerClient('http://localhost:8080/geoserver', 'admin', 'geoserver');
const workspaceManager = new WorkspaceManager(client);

const workspaces = await workspaceManager.getWorkspaces();
console.log(workspaces);
```

## 🧪 Testing
```bash
npm run test
```

.env configuration:
```bash
GEOSERVER_HOST_INTERN=host.docker.internal:8080
GEOSERVER_USER=admin
GEOSERVER_PASSWORD=geoserver
```

## 🛠 Managers Included
- WorkspaceManager
- [coming soon] DatastoreManager, FeatureTypeManager, LayerManager, ...

## 📖 License
MIT