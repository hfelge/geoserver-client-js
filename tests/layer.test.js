import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GeoServerClient } from '../src/GeoServerClient.js';
import { WorkspaceManager } from '../src/managers/WorkspaceManager.js';
import { DatastoreManager } from '../src/managers/DatastoreManager.js';
import { FeatureTypeManager } from '../src/managers/FeatureTypeManager.js';
import { LayerManager } from '../src/managers/LayerManager.js';
import { loadEnv, getPostGISConnectionParameters } from '../utils/env.js';

const { baseUrl, user, password } = loadEnv('.env.test');
const connectionParameters = getPostGISConnectionParameters();

const client = new GeoServerClient(baseUrl, user, password);
const workspaceManager = new WorkspaceManager(client);
const datastoreManager = new DatastoreManager(client);
const featureTypeManager = new FeatureTypeManager(client);
const layerManager = new LayerManager(client);

const workspace = 'test_ws_' + Math.floor(Math.random() * 10000);
const datastore = 'test_ds_' + Math.floor(Math.random() * 10000);
const featureType = 'test_ft_123'; // Die Tabelle muss in PostGIS existieren
const layerName = `${workspace}:${featureType}`; // Layer = workspace:featureType

const featureTypeDefinition = {
    name: featureType,
    nativeName: featureType,
    title: 'Test Feature Type',
    srs: 'EPSG:4326'
};

const skipLayerTests = true; // auf true setzen, wenn Tabelle nicht existiert

describe('LayerManager', () => {
    beforeAll(async () => {
        await workspaceManager.createWorkspace(workspace);
        await datastoreManager.createPostGISDatastore(workspace, datastore, connectionParameters);
        //await featureTypeManager.createFeatureType(workspace, datastore, featureTypeDefinition);
    });

    afterAll(async () => {
        await layerManager.deleteLayer(layerName, true);
        await featureTypeManager.deleteFeatureType(workspace, datastore, featureType);
        await datastoreManager.deleteDatastore(workspace, datastore, true);
        await workspaceManager.deleteWorkspace(workspace, true);
    });

    (skipLayerTests ? it.skip : it)(
        'should publish the layer',
        async () => {
            const published = await layerManager.publishLayer(layerName);
            expect(published).toBe(true);
        }
    );

    (skipLayerTests ? it.skip : it)(
        'should confirm the layer exists',
        async () => {
            const exists = await layerManager.layerExists(layerName);
            expect(exists).toBe(true);
        }
    );

    (skipLayerTests ? it.skip : it)(
        'should return layer info',
        async () => {
            const info = await layerManager.getLayer(layerName);
            expect(info).toHaveProperty('layer');
            expect(info.layer.name).toBe(featureType);
        }
    );

    (skipLayerTests ? it.skip : it)(
        'should update the layer title',
        async () => {
            const updated = await layerManager.updateLayer(layerName, {
                title: 'Updated Test Layer Title'
            });
            expect(updated).toBe(true);
        }
    );

     it(
        'should list all layers',
        async () => {
            const result = await layerManager.getLayers();
            expect(result).toHaveProperty('layers');
            expect(Array.isArray(result.layers.layer)).toBe(true);
        }
    );

    (skipLayerTests ? it.skip : it)(
        'should delete the layer',
        async () => {
            const deleted = await layerManager.deleteLayer(layerName);
            expect(deleted).toBe(true);
        }
    );

    (skipLayerTests ? it.skip : it)(
        'should confirm layer no longer exists',
        async () => {
            const exists = await layerManager.layerExists(layerName);
            expect(exists).toBe(false);
        }
    );
});
