export class RoleManager {
    constructor(client) {
        this.client = client;
    }

    async getRoles() {
        try {
            const response = await this.client.request('GET', '/rest/security/roles');
            return JSON.parse(response.body);
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async roleExists(roleName) {
        const roles = await this.getRoles();
        if (!roles?.roles) return false;
        return roles.roles.includes(roleName);
    }

    async createRole(roleName) {
        try {
            await this.client.request('POST', `/rest/security/roles/role/${encodeURIComponent(roleName)}`);
            return true;
        } catch (e) {
            if (e.message.includes('already exists')) return false;
            throw e;
        }
    }

    async deleteRole(roleName) {
        try {
            await this.client.request('DELETE', `/rest/security/roles/role/${encodeURIComponent(roleName)}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async getRolesForUser(username) {
        try {
            const response = await this.client.request('GET', `/rest/security/roles/user/${encodeURIComponent(username)}`);
            const data = JSON.parse(response.body);
            return data.roles?.length ? data : false;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async getRolesForGroup(groupName) {
        try {
            const response = await this.client.request('GET', `/rest/security/roles/group/${encodeURIComponent(groupName)}`);
            const data = JSON.parse(response.body);
            return data.roles?.length ? data : false;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async assignRoleToUser(username, roleName) {
        try {
            await this.client.request('POST', `/rest/security/roles/role/${encodeURIComponent(roleName)}/user/${encodeURIComponent(username)}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async removeRoleFromUser(username, roleName) {
        try {
            await this.client.request('DELETE', `/rest/security/roles/role/${encodeURIComponent(roleName)}/user/${encodeURIComponent(username)}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async assignRoleToGroup(groupName, roleName) {
        try {
            await this.client.request('POST', `/rest/security/roles/role/${encodeURIComponent(roleName)}/group/${encodeURIComponent(groupName)}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }

    async removeRoleFromGroup(groupName, roleName) {
        try {
            await this.client.request('DELETE', `/rest/security/roles/role/${encodeURIComponent(roleName)}/group/${encodeURIComponent(groupName)}`);
            return true;
        } catch (e) {
            if (e.statusCode === 404) return false;
            throw e;
        }
    }
}
