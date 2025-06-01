export class WorkspaceManager {
    constructor(client) {
        this.client = client;
    }

    async getWorkspaces() {
        const response = await this.client.request('GET', '/rest/workspaces.json');
        return JSON.parse(response.body);
    }

    async getWorkspace(name) {
        try {
            const response = await this.client.request('GET', `/rest/workspaces/${name}.json`);
            return JSON.parse(response.body);
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async workspaceExists(name) {
        try {
            await this.client.request('GET', `/rest/workspaces/${name}.json`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async createWorkspace(name) {
        const payload = { workspace: { name } };

        try {
            await this.client.request('POST', '/rest/workspaces', payload);
            return true;
        } catch (e) {
            if (e.statusCode === 409) return false;
            throw e;
        }
    }

    async updateWorkspace(name, updates) {
        const payload = { workspace: updates };

        try {
            await this.client.request('PUT', `/rest/workspaces/${name}`, payload);
            return true;
        } catch (e) {
            if ([400, 404].includes(e.statusCode)) return false;
            throw e;
        }
    }

    async deleteWorkspace(name, recurse = false) {
        const query = recurse ? '?recurse=true' : '';

        try {
            await this.client.request('DELETE', `/rest/workspaces/${name}${query}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }
}
