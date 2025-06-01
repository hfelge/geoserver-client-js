import fetch from 'node-fetch';
import { GeoServerException } from './GeoServerException.js';

export class GeoServerClient {
    constructor(baseUrl, username, password) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
        this.auth = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
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
