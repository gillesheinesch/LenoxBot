// Constants \\
const { guild: { id }, role_developer, role_translator, dashboard_ignored_roles } = require('../utils/Constants');

// Exports \\
module.exports = class Permissions {
    // ========== Developers ========== \\

    static isDeveloper(client, user) {
        const _guild = client.guilds.get(id);
        const role = _guild && _guild.roles.get(role_developer);
        const checkDev = (role && role.members.has(user.id));

        return checkDev;
    }

    static getDevelopers(client) {
        const _guild = client.guilds.get(id);
        const role = _guild && _guild.roles.get(role_developer);

        return role.members.map(m => client.users.get(m.id));
    }

    // ========== Translator ========== \\

    static isTranslator(client, user) {
        const _guild = client.guilds.get(id);
        const role = _guild && _guild.roles.get(role_translator);
        const checkTr = (role && role.members.has(user.id));

        return checkTr;
    }

    static getTranslators(client) {
        const _guild = client.guilds.get(id);
        const role = _guild && _guild.roles.get(role_translator);

        return role.members.map(m => client.users.get(m.id));
    }

    // ========== Other ========== \\
    
    static getRoles(client) {
        const _guild = client.guilds.get(id);
        const roles = _guild && _guild.roles.filter(r => !dashboard_ignored_roles.includes(r.id) && r.members.size >= 1);

        return roles;
    }

    static getMembersFromARole(client, _role) {
        const _guild = client.guilds.get(id);
        const roles = _guild && _guild.roles;
        const role = roles.get(_role).members.filter(m => !m.user.bot);

        return role.map(m => client.users.get(m.id));
    }
};