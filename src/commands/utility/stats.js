/* eslint-disable guard-for-in */
const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class statsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'stats',
      group: 'utility',
      memberName: 'stats',
      description: 'Bot statistics about a specific user',
      format: 'stats <@User/UserID>',
      aliases: [],
      examples: ['stats @Monkeyyy11#0001', 'stats 246708789930229761'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Information',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    let user = msg.mentions.users.first();

    if (!user && args.slice().length === 0) {
      user = msg.author;
    }
    else if (user) {
      if (user.bot) return msg.reply(lang.userinfo_botinfo);
    }
    else {
      try {
        const fetchedMember = await msg.guild.members.fetch(args.slice().join(' '));
        if (!fetchedMember) new Error('User not found!');
        user = fetchedMember;
        user = user.user;

        if (user.bot) return msg.reply(lang.userinfo_botinfo);
      }
      catch (error) {
        return msg.reply(lang.userinfo_usernotfound);
      }
    }

    const userconfsStats = msg.client.provider.getUser(user.id, 'stats');
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const embedtitle = lang.stats_embedtitle.replace('%usertag', user.tag).replace('%userid', user.id);

    const statsEmbed = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setTitle(embedtitle);

    for (const index in userconfsStats) {
      statsEmbed.addField(lang[`stats_${index}`].replace('%prefix', prefix), userconfsStats[index]);
    }

    msg.channel.send({
      embed: statsEmbed
    });
  }
};
