const LenoxCommand = require('../LenoxCommand.js');

module.exports = class toggleannounceCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'toggleannounce',
      group: 'administration',
      memberName: 'toggleannounce',
      description: 'Sets a channel for announcements, where you can use the announce-command',
      format: 'toggleannounce',
      aliases: [],
      examples: ['toggleannounce'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Announcements',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const channelid = msg.channel.id;
    if (msg.client.provider.getGuild(msg.guild.id, 'announce') === 'false') {
      await msg.client.provider.setGuild(msg.guild.id, 'announce', 'true');
      await msg.client.provider.setGuild(msg.guild.id, 'announcechannel', channelid);

      const channelset = lang.toggleannounce_channelset.replace('%channelname', `**#${msg.channel.name}**`);
      return msg.channel.send(channelset);
    }
    await msg.client.provider.setGuild(msg.guild.id, 'announce', 'false');

    return msg.channel.send(lang.toggleannounce_channeldeleted);
  }
};
