// utils/env.js
import { config } from 'dotenv';

/**
 * Läd Umgebungsvariablen und gibt konfigurierte GeoServer-Zugangsdaten zurück.
 * @param {string} envFile - z.B. '.env', '.env.test'
 */
export function loadEnv(envFile = '.env') {
    config({ path: envFile });

    const fromHost = process.env.RUN_FROM_HOST === 'true';
    const host = fromHost
        ? process.env.GEOSERVER_HOST_EXTERN
        : process.env.GEOSERVER_HOST_INTERN;

    return {
        baseUrl: `http://${host}/geoserver`,
        user: process.env.GEOSERVER_USER,
        password: process.env.GEOSERVER_PASSWORD,
    };
}
