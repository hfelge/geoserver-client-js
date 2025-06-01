export class DatastoreManager {
    constructor(client) {
        this.client = client;
    }

    async getDatastores(workspace) {
        try {
            return await this.client.request('GET', `/rest/workspaces/${workspace}/datastores.json`);
        } catch (e) {
            throw e;
        }
    }

    async getDatastore(workspace, datastore) {
        try {
            return await this.client.request(
                'GET',
                `/rest/workspaces/${workspace}/datastores/${datastore}.json`
            );
        } catch (e) {
            if (e.statusCode === 404) {
                return false;
            }
            throw e;
        }
    }

    async datastoreExists(workspace, datastore) {
        try {
            await this.client.request('GET', `/rest/workspaces/${workspace}/datastores/${datastore}.json`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) {
                return false;
            }
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
            if ([400, 404].includes(e.statusCode)) {
                return false;
            }
            throw e;
        }
    }

    async deleteDatastore(workspace, datastore, recurse = false) {
        const path = datastore.includes('.') ? `${datastore}.xml` : datastore;
        const query = recurse ? '?recurse=true' : '';

        try {
            await this.client.request(
                'DELETE',
                `/rest/workspaces/${workspace}/datastores/${path}${query}`
            );
            return true;
        } catch (e) {
            if (e.statusCode === 404) {
                return false;
            }
            throw e;
        }
    }
}
