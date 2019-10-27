const Discord = require('discord.js');
const moment = require('moment');
const LenoxCommand = require('../LenoxCommand.js');
require('moment-duration-format');

module.exports = class botinfoCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      group: 'utility',
      memberName: 'botinfo',
      description: 'Information about the bot',
      format: 'botinfo',
      aliases: ['binfo', 'bi'],
      examples: ['botinfo'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Information',
      dashboardsettings: false
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const momentlangSet = msg.client.provider.getGuild(msg.guild.id, 'momentLanguage');
    moment.locale(momentlangSet);

    const uptimeserver = moment.duration(msg.client.uptime).format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`);
    const { version } = require('../../package.json');

    let guildsCount;
    await msg.client.shard.fetchClientValues('guilds.size')
      .then((results) => {
        guildsCount = results.reduce((prev, guildCount) => prev + guildCount, 0);
      });

    let usersCount;
    await msg.client.shard.fetchClientValues('users.size')
      .then((results) => {
        usersCount = results.reduce((prev, userCount) => prev + userCount, 0);
      });

    const online = lang.botinfo_online.replace('%guilds', guildsCount).replace('%users', usersCount).replace('%shards', msg.client.shard.count);
    const embed = new Discord.MessageEmbed()
      .setAuthor('LenoxBot', msg.client.user.avatarURL())
      .setColor('#0066CC')
      .setThumbnail(msg.client.user.avatarURL())
      .addField(`⏳ ${lang.botinfo_runtime}`, `${uptimeserver}`)
      .addField(`📡 ${lang.botinfo_stats}`, online)
      .addField(`💻 ${lang.botinfo_website}`, 'http://www.lenoxbot.com/')
      .addField(`💎 ${lang.botinfo_support}`, 'https://lenoxbot.com/donate')
      .addField(`📤 ${lang.botinfo_invite}`, 'https://lenoxbot.com/invite/')
      .addField(`📢 ${lang.botinfo_supportserver}`, 'https://lenoxbot.com/discord/')
      .addField(`🔛 ${lang.botinfo_version}`, version);

    msg.channel.send({
      embed
    });
  }
};
