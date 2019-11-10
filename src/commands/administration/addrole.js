const LenoxCommand = require('../LenoxCommand.js');

module.exports = class addroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'addrole',
      group: 'administration',
      memberName: 'addrole',
      description: 'Assign a role to a discord member',
      format: 'addrole {@User} {name of the role}',
      aliases: ['ar'],
      examples: ['addrole @Monkeyyy11#7584 Member'],
      clientpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES'],
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

    if (msg.mentions.members.size < 1) return msg.reply(lang.addrole_nomention);
    if (addedrole.length < 1) return msg.reply(lang.addrole_norolename);
    if (!foundRole) return msg.reply(lang.addrole_rolenotexist);
    if (user.roles.has(foundRole.id)) return msg.reply(lang.addrole_memberalreadyhasrole);

    user.roles.add(foundRole).then(() => msg.reply(lang.addrole_roleassigned)).catch(() => msg.reply(lang.addrole_norights));
  }
};
