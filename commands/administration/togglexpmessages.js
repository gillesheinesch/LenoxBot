const LenoxCommand = require('../LenoxCommand.js');

module.exports = class togglexpmessagesCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'togglexpmessages',
      group: 'administration',
      memberName: 'togglexpmessages',
      description: 'Set the xp messages on or off',
      format: 'togglexpmessages',
      aliases: [],
      examples: ['togglexpmessages'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'XP',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (!msg.client.provider.getGuild(msg.guild.id, 'xpmessages')) {
      await msg.client.provider.setGuild(msg.guild.id, 'xpmessages', 'false');
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'xpmessages')) {
      await msg.client.provider.setGuild(msg.guild.id, 'xpmessages', 'true');

      return msg.channel.send(lang.togglexpmessages_set);
    }
    await msg.client.provider.setGuild(msg.guild.id, 'xpmessages', 'false');

    return msg.channel.send(lang.togglexpmessages_deleted);
  }
};
