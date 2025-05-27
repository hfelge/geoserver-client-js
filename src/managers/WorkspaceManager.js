export class WorkspaceManager {
    constructor(client) {
        this.client = client;
    }

    async getWorkspaces() {
        const data = await this.client.request('GET', '/rest/workspaces.json');
        return data.workspaces.workspace;
    }

    async createWorkspace(name) {
        const body = { workspace: { name } };
        await this.client.request('POST', '/rest/workspaces', body);
        return true;
    }
}
