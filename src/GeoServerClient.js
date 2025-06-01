import fetch from 'node-fetch';
import { GeoServerException } from './GeoServerException.js';

export class GeoServerClient {
    constructor(baseUrl, username, password) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.auth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    }

    #cachedAvailability = null;

    async isAvailable(forceCheck = false) {
        if (!forceCheck && this.#cachedAvailability !== null) {
            return this.#cachedAvailability;
        }

        try {
            await this.request('GET', '/rest/about/version.json');
            this.#cachedAvailability = true;
        } catch {
            this.#cachedAvailability = false;
        }

        return this.#cachedAvailability;
    }

    setManagers({ workspaceManager, datastoreManager, featureTypeManager, layerManager }) {
        this.workspaceManager = workspaceManager;
        this.datastoreManager = datastoreManager;
        this.featureTypeManager = featureTypeManager;
        this.layerManager = layerManager;
    }

    async publishFeatureLayer(workspace, datastore, featureTypeDefinition, connectionParameters = {}) {
        if (!this.workspaceManager || !this.datastoreManager || !this.featureTypeManager || !this.layerManager) {
            throw new Error('Managers must be set before calling publishFeatureLayer.');
        }

        if (!(await this.workspaceManager.workspaceExists(workspace))) {
            await this.workspaceManager.createWorkspace(workspace);
        }

        if (!(await this.datastoreManager.datastoreExists(workspace, datastore))) {
            const defaultParams = {
                host: 'localhost',
                port: '5432',
                database: 'gis',
                user: 'geo_user',
                passwd: 'secret'
            };

            await this.datastoreManager.createPostGISDatastore(
                workspace,
                datastore,
                { ...defaultParams, ...connectionParameters }
            );
        }

        const name = featureTypeDefinition.name;
        if (!name) {
            throw new Error("FeatureType 'name' is required.");
        }

        if (!(await this.featureTypeManager.featureTypeExists(workspace, datastore, name))) {
            await this.featureTypeManager.createFeatureType(workspace, datastore, featureTypeDefinition);
        }

        return await this.layerManager.publishLayer(name);
    }

    async request(method, path, body = null, headers = {}) {
        const url = `${this.baseUrl}${path}`;
        const options = {
            method,
            headers: {
                Authorization: this.auth,
                Accept: 'application/json',
                ...headers,
            },
        };

        if (body) {
            options.body = typeof body === 'string' ? body : JSON.stringify(body);
            if (!options.headers['Content-Type']) {
                options.headers['Content-Type'] = 'application/json';
            }
        }

        const res = await fetch(url, options);
        const resText = await res.text();

        if (!res.ok) {
            throw new GeoServerException(res.status, resText);
        }

        return {
            status: res.status,
            body: resText,
        };
    }
}
