import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GeoServerClient } from '../src/GeoServerClient.js';
import { WorkspaceManager } from '../src/managers/WorkspaceManager.js';
import { DatastoreManager } from '../src/managers/DatastoreManager.js';
import { loadEnv, getPostGISConnectionParameters } from '../utils/env.js';

const { baseUrl, user, password } = loadEnv('.env.test');
const connectionParameters = getPostGISConnectionParameters();

const client = new GeoServerClient(baseUrl, user, password);
const workspaceManager = new WorkspaceManager(client);
const datastoreManager = new DatastoreManager(client);

const workspace = 'test_ws_' + Math.floor(Math.random() * 10000);
const datastore = 'test_ds_' + Math.floor(Math.random() * 10000);

describe('DatastoreManager', () => {
    beforeAll(async () => {
        await workspaceManager.createWorkspace(workspace);
    });

    afterAll(async () => {
        await datastoreManager.deleteDatastore(workspace, datastore, true);
        await workspaceManager.deleteWorkspace(workspace, true);
    });

    it('should create a PostGIS datastore', async () => {
        const created = await datastoreManager.createPostGISDatastore(workspace, datastore, connectionParameters);
        expect(created).toBe(true);
    });

    it('should return true when datastore exists', async () => {
        const exists = await datastoreManager.datastoreExists(workspace, datastore);
        expect(exists).toBe(true);
    });

    it('should return the created datastore', async () => {
        const result = await datastoreManager.getDatastore(workspace, datastore);
        expect(result).toHaveProperty('dataStore');
        expect(result.dataStore.name).toBe(datastore);
    });

    it('should list all datastores for the workspace', async () => {
        const list = await datastoreManager.getDatastores(workspace);
        expect(list).toHaveProperty('dataStores');
        expect(Array.isArray(list.dataStores.dataStore)).toBe(true);
    });

    it('should update the datastore (noop update)', async () => {
        const updated = await datastoreManager.updateDatastore(workspace, datastore, {
            name: datastore
        });
        expect(updated).toBe(true);
    });

    it('should delete the datastore', async () => {
        const deleted = await datastoreManager.deleteDatastore(workspace, datastore, true);
        expect(deleted).toBe(true);
    });

    it('should return false when datastore no longer exists', async () => {
        const exists = await datastoreManager.datastoreExists(workspace, datastore);
        expect(exists).toBe(false);
    });

    it('should return false for non-existing datastore', async () => {
        const result = await datastoreManager.getDatastore(workspace, 'nonexistent_' + Date.now());
        expect(result).toBe(false);
    });

    it('should return false when deleting nonexistent datastore', async () => {
        const deleted = await datastoreManager.deleteDatastore(workspace, 'nonexistent_' + Date.now(), true);
        expect(deleted).toBe(false);
    });
});
