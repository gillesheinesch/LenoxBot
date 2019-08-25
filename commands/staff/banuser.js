const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class banuserCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'banuser',
      group: 'staff',
      memberName: 'banuser',
      description: 'Adds an discord user to the blacklist',
      format: 'banuser {userId} {reason}',
      aliases: [],
      examples: ['banuser 238590234135101440 Bugusing'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Banuser',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const role = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator');
    if (!role || !msg.member.roles.has(role.id)) return msg.reply(lang.botownercommands_error);

    const userId = args.slice(0, 1).join(' ');

    if (!userId || isNaN(userId)) return msg.reply(lang.banuser_noguildid);
    if (args.slice(1).length === 0) return msg.reply(lang.banuser_noreason);

    for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i += 1) {
      if (msg.client.provider.getBotsettings('botconfs', 'blacklist')[i].userID === userId) return msg.reply(lang.banuser_already);
    }

    const discordUserBanSettings = {
      userID: userId,
      moderator: msg.author.id,
      reason: args.slice(1).join(' '),
      createdAt: Date.now()
    };

    const discordUserName = msg.client.users.has(userId) ? msg.client.users.get(userId).tag : 'undefined';

    const embedtitle = lang.banuser_embedtitle.replace('%userid', userId).replace('%username', discordUserName === 'undefined' ? lang.banuser_usernamenotknown : discordUserName);
    const embeddescription = lang.banuser_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle(embedtitle)
      .setDescription(embeddescription);

    await msg.client.channels.get('497395598182318100').send({
      embed
    });

    const currentBlacklist = msg.client.provider.getBotsettings('botconfs', 'blacklist');
    currentBlacklist.push(discordUserBanSettings);
    await msg.client.provider.setBotsettings('botconfs', 'blacklist', currentBlacklist);

    return msg.reply(lang.banuser_banned);
  }
};
