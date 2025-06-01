export class StyleManager {
    constructor(client) {
        this.client = client;
    }

    async getStyles() {
        const response = await this.client.request('GET', '/rest/styles.json');
        return JSON.parse(response.body);
    }

    async getStyle(styleName) {
        try {
            const response = await this.client.request('GET', `/rest/styles/${styleName}.json`);
            return JSON.parse(response.body);
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async styleExists(styleName) {
        try {
            await this.client.request('GET', `/rest/styles/${styleName}.json`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async styleExistsInWorkspace(workspace, styleName) {
        try {
            await this.client.request('GET', `/rest/workspaces/${workspace}/styles/${styleName}.sld`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async createWorkspaceStyle(workspace, styleName, sldContent) {
        try {
            await this.client.request(
                'POST',
                `/rest/workspaces/${workspace}/styles`,
                sldContent,
                [
                    'Content-Type: application/vnd.ogc.sld+xml',
                    `Slug: ${styleName}.sld`
                ]
            );
            return true;
        } catch (e) {
            if (
                e.statusCode === 409 ||
                (e.statusCode === 403 && e.message.includes('already exists'))
            ) return false;
            throw e;
        }
    }

    async assignStyleToLayer(layerName, styleName) {
        const payload = { style: { name: styleName } };

        try {
            await this.client.request(
                'POST',
                `/rest/layers/${layerName}/styles`,
                payload,
                ['Content-Type: application/json']
            );
            return true;
        } catch (e) {
            if ([400, 404, 406].includes(e.statusCode)) return false;
            throw e;
        }
    }

    async updateStyle(name, sldContent) {
        try {
            await this.client.request(
                'PUT',
                `/rest/styles/${name}`,
                sldContent,
                ['Content-Type: application/vnd.ogc.sld+xml']
            );
            return true;
        } catch (e) {
            if (
                [400, 404].includes(e.statusCode) ||
                e.message.includes('getResource() because "original" is null')
            ) return false;
            throw e;
        }
    }

    async deleteStyle(name) {
        try {
            await this.client.request('DELETE', `/rest/styles/${name}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }
}
