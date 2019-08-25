const LenoxCommand = require('../LenoxCommand.js');

module.exports = class muteroleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'muterole',
      group: 'administration',
      memberName: 'muterole',
      description: 'Defines a muted role which muted users will get',
      format: 'muterole {name of the role}',
      aliases: [],
      examples: ['muterole muted'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Mute',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (args.length < 1) return msg.reply(lang.muterole_noinput);

    const role = msg.guild.roles.find((guildRole) => guildRole.name.toLowerCase() === args.slice().join(' ').toLowerCase());
    if (!role) return msg.reply(lang.muterole_rolenotexist);

    if (!msg.client.provider.getGuild(msg.guild.id, 'muterole')) {
      await msg.client.provider.setGuild(msg.guild.id, 'muterole', '');
    }

    await msg.client.provider.setGuild(msg.guild.id, 'muterole', role.id);
    msg.channel.send(lang.muterole_mutedroleset);
  }
};
