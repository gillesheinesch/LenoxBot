const LenoxCommand = require('../LenoxCommand.js');

module.exports = class togglebyeCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'togglebye',
      group: 'administration',
      memberName: 'togglebye',
      description: 'Disable the goodbye message',
      format: 'togglebye',
      aliases: [],
      examples: ['togglebye'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Bye',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (msg.client.provider.getGuild(msg.guild.id, 'bye') === 'false') {
      await msg.client.provider.setGuild(msg.guild.id, 'bye', 'true');
      const channelid = msg.channel.id;
      await msg.client.provider.setGuild(msg.guild.id, 'byechannel', channelid);

      const channelset = lang.togglebye_channelset.replace('%channelname', msg.channel.name);
      msg.channel.send(channelset);
    }
    else if (msg.client.provider.getGuild(msg.guild.id, 'bye') === 'true') {
      await msg.client.provider.setGuild(msg.guild.id, 'bye', 'false');
      msg.channel.send(lang.togglebye_channeldeleted);
    }
  }
};
