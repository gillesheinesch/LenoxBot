const LenoxCommand = require('../LenoxCommand.js');

module.exports = class approveroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'approverole',
      group: 'application',
      memberName: 'approverole',
      description: 'Defines the role that members get if their application has been accepted',
      format: 'approverole {name of the role}',
      aliases: [],
      examples: ['approverole accepted'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Roles',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (args.length < 1) return msg.reply(lang.approverole_noinput);

    const role = msg.guild.roles.find((guildRole) => guildRole.name.toLowerCase() === args.slice().join(' ').toLowerCase());
    if (!role) return msg.reply(lang.approverole_rolenotexist);

    const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
    currentApplication.role = role.id;
    await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

    const set = lang.approverole_set.replace('%rolename', role.name);
    return msg.channel.send(set);
  }
};
