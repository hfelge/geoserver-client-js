// utils/env.js
import { config } from 'dotenv';

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
        workspace: process.env.GEOSERVER_WORKSPACE,
        datastore: process.env.GEOSERVER_DATASTORE,
    };
}

export function getPostGISConnectionParameters() {
    return {
        host: process.env.POSTGIS_HOST,
        port: process.env.POSTGIS_PORT,
        database: process.env.POSTGIS_DB,
        user: process.env.POSTGIS_USER,
        passwd: process.env.POSTGIS_PASSWORD,
        schema: process.env.POSTGIS_SCHEMA,
        exposePrimaryKeys: 'true',
        LooseBBox: 'true',
        dbtype: 'postgis'
    };
}
