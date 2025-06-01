export class FeatureTypeManager {
    constructor(client) {
        this.client = client;
    }

    async getFeatureTypes(workspace, datastore) {
        try {
            const response = await this.client.request(
                'GET',
                `/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes.json`
            );
            return response.featureTypes;
        } catch (e) {
            throw e;
        }
    }

    async getFeatureType(workspace, datastore, name) {
        try {
            const response = await this.client.request(
                'GET',
                `/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes/${name}.json`
            );
            return response.featureType;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async featureTypeExists(workspace, datastore, name) {
        try {
            await this.client.request(
                'GET',
                `/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes/${name}.json`
            );
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async createFeatureType(workspace, datastore, definition) {
        const payload = { featureType: definition };

        try {
            await this.client.request(
                'POST',
                `/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes`,
                payload
            );
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

    async updateFeatureType(workspace, datastore, name, updates) {
        const payload = { featureType: updates };

        try {
            await this.client.request(
                'PUT',
                `/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes/${name}`,
                payload
            );
            return true;
        } catch (e) {
            if ([400, 404].includes(e.statusCode)) return false;
            throw e;
        }
    }

    async deleteFeatureType(workspace, datastore, name, recurse = true) {
        const query = recurse ? '?recurse=true' : '';

        try {
            await this.client.request(
                'DELETE',
                `/rest/workspaces/${workspace}/datastores/${datastore}/featuretypes/${name}${query}`
            );
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }
}
