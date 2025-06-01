export class WorkspaceManager {
    constructor(client) {
        this.client = client;
    }

    async getWorkspaces() {
        try {
            return await this.client.request('GET', '/rest/workspaces.json');
        } catch (e) {
            throw e;
        }
    }

    async getWorkspace(name) {
        try {
            return await this.client.request('GET', `/rest/workspaces/${name}.json`);
        } catch (e) {
            if (e.statusCode === 404) {
                return false;
            }
            throw e;
        }
    }

    async workspaceExists(workspace) {
        try {
            await this.client.request('GET', `/rest/workspaces/${workspace}.json`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) {
                return false;
            }
            throw e;
        }
    }

    async createWorkspace(workspace) {
        const payload = { workspace: { name: workspace } };

        try {
            await this.client.request('POST', '/rest/workspaces', payload);
            return true;
        } catch (e) {
            if (e.statusCode === 409) {
                return false;
            }
            throw e;
        }
    }

    async updateWorkspace(workspace, updates) {
        const payload = { workspace: updates };

        try {
            await this.client.request('PUT', `/rest/workspaces/${workspace}`, payload);
            return true;
        } catch (e) {
            if ([400, 404].includes(e.statusCode)) {
                return false;
            }
            throw e;
        }
    }

    async deleteWorkspace(workspace, recurse = false) {
        const query = recurse ? '?recurse=true' : '';

        try {
            await this.client.request('DELETE', `/rest/workspaces/${workspace}${query}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) {
                return false;
            }
            throw e;
        }
    }
}
