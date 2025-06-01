import { describe, it, expect } from 'vitest';
import { GeoServerClient } from '../src/GeoServerClient.js';
import { FeatureTypeManager } from '../src/managers/FeatureTypeManager.js';
import { loadEnv, getPostGISConnectionParameters } from '../utils/env.js';
import {WorkspaceManager} from "../src/managers/WorkspaceManager.js";
import {DatastoreManager} from "../src/managers/DatastoreManager.js";

const { baseUrl, user, password, workspace, datastore } = loadEnv('.env.test');
const client = new GeoServerClient(baseUrl, user, password);
const workspaceManager = new WorkspaceManager(client);
const datastoreManager = new DatastoreManager(client);
const featureTypeManager = new FeatureTypeManager(client);

const testActive = false; // auf true setzen, wenn Tabelle wie 'test_ft_123' in PostGIS vorhanden ist
const featureType = 'test_ft_123';

// const workspace = 'tiger';
// const datastore = 'tiger';

const featureTypeDefinition = {
    name: featureType,
    nativeName: featureType,
    title: 'Test FeatureType',
    srs: 'EPSG:4326'
};

beforeAll(async () => {

    // Workspace anlegen, falls nicht vorhanden
    const existsWorkspace = await workspaceManager.workspaceExists(workspace);
    if (!existsWorkspace) {
        await workspaceManager.createWorkspace(workspace);
    }

    // Datastore anlegen, falls nicht vorhanden
    const existsDatastore = await datastoreManager.datastoreExists(workspace, datastore);
    if (!existsDatastore) {
        await datastoreManager.createPostGISDatastore(workspace, datastore, getPostGISConnectionParameters());
    }

    // Test-Tabelle prüfen/anlegen (nur falls gewünscht — sonst manuell vorher)
    // Achtung: das geht nur, wenn du direkten DB-Zugriff aus JS hast – sonst per SQL vorab:
    // CREATE TABLE test_ft_geom (id SERIAL PRIMARY KEY, geom GEOMETRY(Point, 4326));
});
describe('FeatureTypeManager', () => {
    it('should return false for missing FeatureType', async () => {
        const exists = await featureTypeManager.featureTypeExists(workspace, datastore, 'missing_' + Math.random());
        expect(exists).toBe(false);
    });

    (testActive ? it : it.skip)(
        'should return all featureTypes for datastore', async () => {
        const response = await featureTypeManager.getFeatureTypes(workspace, datastore);
        expect(response).toHaveProperty('featureTypes');
    });

    it('should return false if FeatureType not found', async () => {
        const result = await featureTypeManager.getFeatureType(workspace, datastore, 'missing_' + Math.random());
        expect(result).toBe(false);
    });

    (testActive ? it : it.skip)(
        'should create a FeatureType from PostGIS table',
        async () => {
            const created = await featureTypeManager.createFeatureType(workspace, datastore, featureTypeDefinition);
            expect(created).toBe(true);
        }
    );

    (testActive ? it : it.skip)(
        'should update the FeatureType',
        async () => {
            const updated = await featureTypeManager.updateFeatureType(
                workspace,
                datastore,
                featureType,
                { title: 'Updated FeatureType Title' }
            );
            expect(updated).toBe(true);
        }
    );

    (testActive ? it : it.skip)(
        'should delete the FeatureType',
        async () => {
            const deleted = await featureTypeManager.deleteFeatureType(workspace, datastore, featureType);
            expect(deleted).toBe(true);
        }
    );
});
