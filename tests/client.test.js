import { loadEnv } from '../utils/env.js';
import { GeoServerClient } from '../src/GeoServerClient.js';

const { baseUrl, user, password } = loadEnv('.env.test');

describe('GeoServerClient', () => {
    let client;

    beforeAll(() => {
        client = new GeoServerClient(baseUrl, user, password);
    });

    test('should confirm GeoServer is available', async () => {
        const available = await client.isAvailable(true); // force check
        expect(available).toBe(true);
    });

    test('should cache availability result', async () => {
        // We assume availability was already cached in the previous test
        const cached = await client.isAvailable(); // no force
        expect(cached).toBe(true);
    });
});
