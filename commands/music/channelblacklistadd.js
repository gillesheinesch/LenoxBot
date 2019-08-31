const LenoxCommand = require('../LenoxCommand.js');

module.exports = class channelblacklistaddCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'channelblacklistadd',
      group: 'music',
      memberName: 'channelblacklistadd',
      description: 'Adds a voicechannel to the blacklist',
      format: 'channelblacklistadd {name of the voicechannel}',
      aliases: [],
      examples: ['channelblacklistadd music #1'],
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

    if (!input || input.length === 0) return msg.reply(lang.channelblacklistadd_error);

    let channel;
    try {
      channel = msg.guild.channels.find((r) => r.name.toLowerCase() === input.join(' ').toLowerCase());
    }
    catch (error) {
      return msg.channel.send(lang.channelblacklistadd_channelnotfind);
    }

    if (!channel) return msg.reply(lang.channelblacklistadd_channelnotfind);
    if (channel.type !== 'voice') return msg.reply(lang.channelblacklistadd_wrongtype);

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist').length; i += 1) {
      if (msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist')[i] === channel.id) return msg.reply(lang.channelblacklistadd_already);
    }

    const channelid = channel.id;

    const currentMusicchannelblacklist = msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist');
    currentMusicchannelblacklist.push(channelid);
    await msg.client.provider.setGuild(msg.guild.id, 'musicchannelblacklist', currentMusicchannelblacklist);

    return msg.reply(lang.channelblacklistadd_added);
  }
};
