# GeoServer Client JS

A modern JavaScript client for the GeoServer REST API. Fully modular, testable, and Node.js-compatible.

## ✅ Features

- Workspace, Datastore, FeatureType, Layer, Style, Role, User & Group management
- Unified request + error handling via `GeoServerException`
- Fully ESM-compatible (Node.js / Vite)
- `.env`-based configuration for testing
- 100% test coverage via Vitest
- `publishFeatureLayer()` helper method
- Supports GeoServer >= 2.21.x

## 📦 Installation

```bash
npm install geoserver-client-js
```

## 📄 Usage Example
```js
import { GeoServerClient } from 'geoserver-client-js';
import { WorkspaceManager, DatastoreManager, FeatureTypeManager, LayerManager, StyleManager } from 'geoserver-client-js';

const client = new GeoServerClient('http://localhost:8080/geoserver', 'admin', 'geoserver');

// Workspaces
const workspaceManager = new WorkspaceManager(client);
await workspaceManager.createWorkspace('demo');
console.log(await workspaceManager.getWorkspaces());

// Datastores
const datastoreManager = new DatastoreManager(client);
await datastoreManager.createPostGISDatastore('demo', 'demo_ds', {
  host: 'localhost',
  port: '5432',
  database: 'gis',
  user: 'geo_user',
  passwd: 'secret',
});
console.log(await datastoreManager.getDatastores('demo'));

// Feature Types
const featureTypeManager = new FeatureTypeManager(client);
await featureTypeManager.createFeatureType('demo', 'demo_ds', {
  name: 'roads',
  title: 'Road Network',
  srs: 'EPSG:4326',
});
console.log(await featureTypeManager.getFeatureTypes('demo', 'demo_ds'));

// Layer publishing
const layerManager = new LayerManager(client);
await layerManager.publishLayer('roads');
console.log(await layerManager.getLayers());

// Styles
const styleManager = new StyleManager(client);
const sld = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:ogc="http://www.opengis.net/ogc"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>Simple Polygon</Name>
    <UserStyle>
      <Title>Simple Polygon</Title>
      <FeatureTypeStyle>
        <Rule>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#FF0000</CssParameter>
            </Fill>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

await styleManager.createWorkspaceStyle('demo', 'red-style', sld);
await styleManager.assignStyleToLayer('roads', 'red-style');
```

## 🧪 Testing
```bash
npm run test
```

.env.test example:
```bash
GEOSERVER_HOST_INTERN=host.docker.internal:8080
GEOSERVER_USER=admin
GEOSERVER_PASSWORD=geoserver
GEOSERVER_WORKSPACE=test_ws
GEOSERVER_DATASTORE=test_ds
```

## 🛠 Managers Included
- WorkspaceManager
- DatastoreManager
- FeatureTypeManager
- LayerManager
- StyleManager
- RoleManager
- UserManager
- UserGroupManager

## 🧩 Utility Features
- GeoServerClient#isAvailable() – check if GeoServer is online
- GeoServerClient#publishFeatureLayer() – helper for workspace + datastore + featureType + layer

## 📖 License
MIT © https://github.com/hfelge