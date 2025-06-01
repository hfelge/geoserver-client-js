import { describe, it, expect, beforeAll } from 'vitest';
import { GeoServerClient } from '../src/GeoServerClient.js';
import { WorkspaceManager } from '../src/managers/WorkspaceManager.js';
import { loadEnv } from '../utils/env.js';

const { baseUrl, user, password } = loadEnv('.env.test');
const client = new GeoServerClient(baseUrl, user, password);
const workspaceManager = new WorkspaceManager(client);

const testWorkspace = 'test_ws_' + Math.floor(Math.random() * 10000);

describe('WorkspaceManager', () => {
    it('should create a workspace', async () => {
        const created = await workspaceManager.createWorkspace(testWorkspace);
        expect(created).toBe(true);
    });

    it('should detect that the workspace exists', async () => {
        const exists = await workspaceManager.workspaceExists(testWorkspace);
        expect(exists).toBe(true);
    });

    it('should return the workspace', async () => {
        const ws = await workspaceManager.getWorkspace(testWorkspace);
        expect(ws).toHaveProperty('workspace');
        expect(ws.workspace.name).toBe(testWorkspace);
    });

    it('should return all workspaces as an array', async () => {
        const list = await workspaceManager.getWorkspaces();
        expect(list).toHaveProperty('workspaces');
        expect(Array.isArray(list.workspaces.workspace)).toBe(true);
    });

    it('should update the workspace (description or other allowed attribute)', async () => {
        const updated = await workspaceManager.updateWorkspace(testWorkspace, {
            name: testWorkspace // GeoServer only allows "name" here
        });
        expect(updated).toBe(true);
    });

    it('should delete the workspace', async () => {
        const deleted = await workspaceManager.deleteWorkspace(testWorkspace, true);
        expect(deleted).toBe(true);
    });

    it('should return false for a deleted workspace', async () => {
        const exists = await workspaceManager.workspaceExists(testWorkspace);
        expect(exists).toBe(false);
    });

    it('should return false when getting a nonexistent workspace', async () => {
        const result = await workspaceManager.getWorkspace('nonexistent_' + Date.now());
        expect(result).toBe(false);
    });

    it('should return false when deleting a nonexistent workspace', async () => {
        const result = await workspaceManager.deleteWorkspace('nonexistent_' + Date.now());
        expect(result).toBe(false);
    });
});
