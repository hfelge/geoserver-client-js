import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GeoServerClient } from '../src/GeoServerClient.js';
import { WorkspaceManager } from '../src/managers/WorkspaceManager.js';
import { DatastoreManager } from '../src/managers/DatastoreManager.js';
import { FeatureTypeManager } from '../src/managers/FeatureTypeManager.js';
import { loadEnv, getPostGISConnectionParameters } from '../utils/env.js';

const { baseUrl, user, password } = loadEnv('.env.test');
const connectionParameters = getPostGISConnectionParameters();

const client = new GeoServerClient(baseUrl, user, password);
const workspaceManager = new WorkspaceManager(client);
const datastoreManager = new DatastoreManager(client);
const featureTypeManager = new FeatureTypeManager(client);

const workspace = 'test_ws_' + Math.floor(Math.random() * 10000);
const datastore = 'test_ds_' + Math.floor(Math.random() * 10000);
const featureType = 'test_ft_123';

const featureTypeDefinition = {
    name: featureType,
    nativeName: featureType,
    title: 'Test Feature Type',
    srs: 'EPSG:4326'
};

const testActive = false; // auf true setzen, wenn Tabelle vorhanden

describe('FeatureTypeManager', () => {
    beforeAll(async () => {
        await workspaceManager.createWorkspace(workspace);
        await datastoreManager.createPostGISDatastore(workspace, datastore, connectionParameters);

        // Vorausgesetzt: In deiner PostGIS-Datenbank existiert eine Tabelle mit Namen `featureType`
        // Beispiel (in SQL):
        // CREATE TABLE test_ft_123 (id SERIAL PRIMARY KEY, geom GEOMETRY(Point, 4326));
    });

    afterAll(async () => {
        await featureTypeManager.deleteFeatureType(workspace, datastore, featureType, true);
        await datastoreManager.deleteDatastore(workspace, datastore, true);
        await workspaceManager.deleteWorkspace(workspace, true);
    });

    (testActive ? it : it.skip)(
        'should create a FeatureType from PostGIS table', async () => {
        const created = await featureTypeManager.createFeatureType(workspace, datastore, featureTypeDefinition);
        expect(created).toBe(true);
    });

    (testActive ? it : it.skip)(
        'should confirm the FeatureType exists', async () => {
        const exists = await featureTypeManager.featureTypeExists(workspace, datastore, featureType);
        expect(exists).toBe(true);
    });

    (testActive ? it : it.skip)(
        'should return the FeatureType definition', async () => {
        const result = await featureTypeManager.getFeatureType(workspace, datastore, featureType);
        expect(result).toHaveProperty('featureType');
        expect(result.featureType.name).toBe(featureType);
    });

    (testActive ? it : it.skip)(
        'should list FeatureTypes in the datastore', async () => {
        const list = await featureTypeManager.getFeatureTypes(workspace, datastore);
        expect(list).toHaveProperty('featureTypes');
        expect(Array.isArray(list.featureTypes.featureType)).toBe(true);
    });

    (testActive ? it : it.skip)(
        'should update the FeatureType title', async () => {
        const updated = await featureTypeManager.updateFeatureType(workspace, datastore, featureType, {
            title: 'Updated FeatureType Title'
        });
        expect(updated).toBe(true);
    });

    (testActive ? it : it.skip)(
        'should delete the FeatureType', async () => {
        const deleted = await featureTypeManager.deleteFeatureType(workspace, datastore, featureType, true);
        expect(deleted).toBe(true);
    });

    it('should confirm the FeatureType is deleted', async () => {
        const exists = await featureTypeManager.featureTypeExists(workspace, datastore, featureType);
        expect(exists).toBe(false);
    });
});
