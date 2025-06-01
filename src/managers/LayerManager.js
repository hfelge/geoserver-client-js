export class LayerManager {
    constructor(client) {
        this.client = client;
    }

    async getLayers() {
        const response = await this.client.request('GET', '/rest/layers.json');
        return JSON.parse(response.body);
    }

    async getLayer(name) {
        try {
            const response = await this.client.request('GET', `/rest/layers/${name}.json`);
            return JSON.parse(response.body);
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async layerExists(name) {
        try {
            await this.client.request('GET', `/rest/layers/${name}.json`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async publishLayer(layerName) {
        const payload = {
            layer: {
                enabled: true,
                defaultStyle: { name: 'default' },
            }
        };

        try {
            await this.client.request('PUT', `/rest/layers/${layerName}`, payload);
            return true;
        } catch (e) {
            if (
                [400, 404].includes(e.statusCode) ||
                e.message.includes('because "original" is null')
            ) return false;
            throw e;
        }
    }

    async updateLayer(name, updates) {
        const payload = { layer: updates };

        try {
            await this.client.request('PUT', `/rest/layers/${name}`, payload);
            return true;
        } catch (e) {
            if (
                [400, 404].includes(e.statusCode) ||
                e.message.includes('because "original" is null')
            ) return false;
            throw e;
        }
    }

    async deleteLayer(name, recurse = true) {
        const query = recurse ? '?recurse=true' : '';

        try {
            await this.client.request('DELETE', `/rest/layers/${name}${query}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }
}
