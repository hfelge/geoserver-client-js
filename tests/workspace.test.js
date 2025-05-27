// tests/workspace.test.js
import { loadEnv } from '../utils/env.js';
const { baseUrl, user, password } = loadEnv('.env.test');

import { GeoServerClient } from '../src/GeoServerClient.js';
import { WorkspaceManager } from '../src/managers/WorkspaceManager.js';

const client = new GeoServerClient(baseUrl, user, password);
const workspaceManager = new WorkspaceManager(client);

describe('WorkspaceManager', () => {
    it('should list workspaces', async () => {
        const workspaces = await workspaceManager.getWorkspaces();
        expect(workspaces).toBeInstanceOf(Array);
    });
});
