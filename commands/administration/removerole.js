const LenoxCommand = require('../LenoxCommand.js');

module.exports = class removeroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'removerole',
      group: 'administration',
      memberName: 'removerole',
      description: 'Removes a role to a discord member',
      format: 'removerole {@User} {name of the role}',
      aliases: ['rr'],
      examples: ['removerole @Monkeyyy11#7584 Member'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['MANAGE_ROLES'],
      shortDescription: 'Roles',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const addedrole = args.slice(1).join(' ');
    const user = msg.mentions.members.first();
    const foundRole = msg.guild.roles.find((role) => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

    if (msg.mentions.members.size < 1) return msg.reply(lang.removerole_nomention);
    if (addedrole.length < 1) return msg.reply(lang.removerole_norolename);
    if (!foundRole) return msg.reply(lang.removerole_rolenotexist);
    if (!user.roles.has(foundRole.id)) return msg.reply(lang.removerole_error);

    user.roles.remove(foundRole).then(() => msg.reply(lang.removerole_roleremoved)).catch(() => msg.reply(lang.removerole_missingpermission));
  }
};
