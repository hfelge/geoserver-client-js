import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GeoServerClient } from '../src/GeoServerClient.js';
import { RoleManager } from '../src/managers/RoleManager.js';
import { loadEnv } from '../utils/env.js';

const { baseUrl, user, password } = loadEnv('.env.test');
const client = new GeoServerClient(baseUrl, user, password);
const roleManager = new RoleManager(client);

const testRole = 'test_role_' + Math.floor(Math.random() * 10000);
const testUser = 'admin'; // ← sollte existieren
const testGroup = 'ADMIN'; // ← sollte existieren, Standardgruppe in GeoServer

describe('RoleManager', () => {
    it('should create a new role', async () => {
        const created = await roleManager.createRole(testRole);
        expect(created).toBe(true);
    });

    it('should return true if role exists', async () => {
        const exists = await roleManager.roleExists(testRole);
        expect(exists).toBe(true);
    });

    it('should assign role to user', async () => {
        const assigned = await roleManager.assignRoleToUser(testUser, testRole);
        expect(assigned).toBe(true);
    });

    it('should return roles for user', async () => {
        const result = await roleManager.getRolesForUser(testUser);
        expect(result).not.toBe(false);
        expect(Array.isArray(result.roles)).toBe(true);
        expect(result.roles).toContain(testRole);
    });

    it('should remove role from user', async () => {
        const removed = await roleManager.removeRoleFromUser(testUser, testRole);
        expect(removed).toBe(true);
    });

    it('should assign role to group', async () => {
        const assigned = await roleManager.assignRoleToGroup(testGroup, testRole);
        expect(assigned).toBe(true);
    });

    it('should return roles for group', async () => {
        const result = await roleManager.getRolesForGroup(testGroup);
        expect(result).not.toBe(false);
        expect(Array.isArray(result.roles)).toBe(true);
        expect(result.roles).toContain(testRole);
    });

    it('should remove role from group', async () => {
        const removed = await roleManager.removeRoleFromGroup(testGroup, testRole);
        expect(removed).toBe(true);
    });

    it('should delete the role', async () => {
        const deleted = await roleManager.deleteRole(testRole);
        expect(deleted).toBe(true);
    });

    it('should confirm the role no longer exists', async () => {
        const exists = await roleManager.roleExists(testRole);
        expect(exists).toBe(false);
    });

    it('should return false for missing user roles', async () => {
        const result = await roleManager.getRolesForUser('missing_user_' + Math.floor(Math.random() * 10000));
        expect(result).toBe(false);
    });

    it('should return false for missing group roles', async () => {
        const result = await roleManager.getRolesForGroup('missing_group_' + Math.floor(Math.random() * 10000));
        expect(result).toBe(false);
    });
});
