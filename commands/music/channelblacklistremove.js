const LenoxCommand = require('../LenoxCommand.js');

module.exports = class channelblacklistremoveCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'channelblacklistremove',
      group: 'music',
      memberName: 'channelblacklistremove',
      description: 'Adds a voicechannel to the blacklist',
      format: 'channelblacklistremove {name of the voicechannel}',
      aliases: [],
      examples: ['channelblacklistremove music #1'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Channelblacklist',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const input = args.slice();

    if (!input || input.length === 0) return msg.reply(lang.channelblacklistremove_error);

    let channel;
    try {
      channel = msg.guild.channels.find((r) => r.name.toLowerCase() === input.join(' ').toLowerCase());
    }
    catch (error) {
      return msg.reply(lang.channelblacklistadd_channelnotfind);
    }

    if (!channel) return msg.reply(lang.channelblacklistadd_channelnotfind);
    if (channel.type !== 'voice') return msg.reply(lang.channelblacklistremove_wrongtype);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist').length; i += 1) {
      if (channel.id === msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist')[i]) {
        const currentMusicchannelblacklist = msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist');
        currentMusicchannelblacklist.splice(i, 1);
        await msg.client.provider.setGuild(msg.guild.id, 'musicchannelblacklist', currentMusicchannelblacklist);
        return msg.reply(lang.channelblacklistremove_removed);
      }
    }

    return msg.reply(lang.channelblacklistremove_channelnotblacklisted);
  }
};
