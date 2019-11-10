const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class channelblacklistCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'channelblacklist',
      group: 'music',
      memberName: 'channelblacklist',
      description: 'Displays a list of which voicechannels have been blacklisted',
      format: 'channelblacklist',
      aliases: [],
      examples: ['channelblacklist'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Channelblacklist',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist').length === 0) return msg.reply(lang.channelblacklist_error);

    const array = [];

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist').length; i += 1) {
      try {
        const channelname = msg.guild.channels.get(msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist')[i]).name;
        array.push(`${channelname} (${msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist')[i]})`);
      }
      catch (error) {
        const currentMusicchannelblacklist = msg.client.provider.getGuild(msg.guild.id, 'musicchannelblacklist');
        currentMusicchannelblacklist.splice(i, 1);
        await msg.client.provider.setGuild(msg.guild.id, 'musicchannelblacklist', currentMusicchannelblacklist);
      }
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#ff9933')
      .setDescription(array.join('\n'))
      .setAuthor(lang.channelblacklist_embed);

    msg.channel.send({ embed });
  }
};
