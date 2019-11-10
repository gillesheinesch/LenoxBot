const { client_guild, role_developer, role_manager, role_translator } = require('../utils/Constants');

module.exports = class Permissions {
    static isDeveloper (client, user) {
        const guild = client.guilds.get(client_guild);
        const role = guild && guild.roles.get(role_developer);
        const check = (role && role.members.has(user.id));

        return check;
    }

    static isManager (client, user) {
        const guild = client.guilds.get(client_guild);
        const role = guild && guild.roles.get(role_manager);
        const check = (role && role.members.has(user.id)) || this.isDeveloper(client, user);

        return check;
    }

    static isTranslator (client, user) {
        const guild = client.guilds.get(client_guild);
        const role = guild && guild.roles.get(role_translator);
        const check = (role && role.members.has(user.id));

        return check;
    }
}