export class GeoServerException extends Error {
    constructor(statusCode, message) {
        super(`GeoServer API error ${statusCode}: ${message}`);
        this.statusCode = statusCode;
        this.name = 'GeoServerException';
    }
}
