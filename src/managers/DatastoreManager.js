export class DatastoreManager {
    constructor(client) {
        this.client = client;
    }

    async getDatastores(workspace) {
        const response = await this.client.request('GET', `/rest/workspaces/${workspace}/datastores.json`);
        return JSON.parse(response.body);
    }

    async getDatastore(workspace, datastore) {
        try {
            const response = await this.client.request('GET', `/rest/workspaces/${workspace}/datastores/${datastore}.json`);
            return JSON.parse(response.body);
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async datastoreExists(workspace, datastore) {
        try {
            await this.client.request('GET', `/rest/workspaces/${workspace}/datastores/${datastore}.json`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async createPostGISDatastore(workspace, datastore, connectionParameters) {
        const payload = {
            dataStore: {
                name: datastore,
                connectionParameters: {
                    dbtype: 'postgis',
                    ...connectionParameters
                }
            }
        };

        try {
            await this.client.request('POST', `/rest/workspaces/${workspace}/datastores`, payload);
            return true;
        } catch (e) {
            if (
                e.statusCode === 409 ||
                (e.statusCode === 500 && e.message.includes('already exists'))
            ) {
                return false;
            }
            throw e;
        }
    }

    async updateDatastore(workspace, datastore, updates) {
        const payload = { dataStore: updates };

        try {
            await this.client.request('PUT', `/rest/workspaces/${workspace}/datastores/${datastore}`, payload);
            return true;
        } catch (e) {
            if ([400, 404].includes(e.statusCode)) return false;
            throw e;
        }
    }

    async deleteDatastore(workspace, datastore, recurse = false) {
        const query = recurse ? '?recurse=true' : '';
        const datastorePath = datastore.includes('.') ? `${datastore}.xml` : datastore;

        try {
            await this.client.request('DELETE', `/rest/workspaces/${workspace}/datastores/${datastorePath}${query}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }
}
