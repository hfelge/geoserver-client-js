import { describe, it, expect } from 'vitest';
import { GeoServerException } from '../src/GeoServerException.js';

describe('GeoServerException', () => {
    it('should store status code and message correctly', () => {
        const error = new GeoServerException(404, 'Not Found');

        expect(error).toBeInstanceOf(Error);
        expect(error.name).toBe('GeoServerException');
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe('GeoServer API error 404: Not Found');
    });
});
