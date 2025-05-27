import { loadEnv } from './utils/env.js';
import { GeoServerClient, WorkspaceManager } from './index.js';

const { baseUrl, user, password } = loadEnv(); // verwendet .env

const client = new GeoServerClient(baseUrl, user, password);
const workspaceManager = new WorkspaceManager(client);

const run = async () => {
    try {
        const workspaces = await workspaceManager.getWorkspaces();
        console.log('Gefundene Workspaces:', workspaces);
    } catch (err) {
        console.error('Fehler:', err);
    }
};

run();
