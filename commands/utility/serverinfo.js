const Discord = require('discord.js');
const moment = require('moment');
const LenoxCommand = require('../LenoxCommand.js');
require('moment-duration-format');

module.exports = class serverinfoCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      group: 'utility',
      memberName: 'serverinfo',
      description: 'Shows you some information about the current discord server',
      format: 'serverinfo',
      aliases: ['sinfo', 'si'],
      examples: ['serverinfo'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Information',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    moment.locale(msg.client.provider.getGuild(msg.guild.id, 'momentLanguage'));

    const servercreated = moment(msg.guild.createdAt).format('MMMM Do YYYY, h:mm:ss a');

    const emojis = [];
    if (msg.guild.emojis.size !== 0) {
      msg.guild.emojis.forEach((r) => {
        const emoji = msg.client.emojis.resolve(r.id);
        emojis.push(emoji);
      });
    }

    const emojisembed = [];
    if (emojis.length === 0) {
      emojisembed.push(lang.serverinfo_emojisnone);
    }
    else if (emojis.join(' ').length > 1020) {
      for (let i = 0; i < emojis.length; i += 1) {
        if (emojisembed.join(' ').length < 980) {
          emojisembed.push(emojis[i]);
        }
      }
      emojisembed.push('...');
    }
    else {
      emojisembed.push(emojis.join(' '));
    }

    const embed = new Discord.MessageEmbed()
      .setAuthor(`${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL())
      .setColor('#0066CC')
      .setTimestamp()
      .setThumbnail(msg.guild.iconURL())
      .addField(`🤵 ${lang.serverinfo_members}`, msg.guild.memberCount)
      .addField(`🗻 ${lang.serverinfo_region}`, msg.guild.region)
      .addField(`📲 ${lang.serverinfo_channels}`, msg.guild.channels.size)
      .addField(`⏳ ${lang.serverinfo_created}`, servercreated)
      .addField(`☑ ${lang.serverinfo_verification}`, msg.guild.verificationLevel || lang.serverinfo_noverification)
      .addField(`📤 ${lang.serverinfo_afkchannel}`, msg.guild.afkChannel === null ? lang.serverinfo_noafkchannel : msg.guild.afkChannel.name)
      .addField(`🎊 ${lang.serverinfo_emojis}`, emojisembed.join(' '));

    msg.channel.send({ embed });
  }
};
