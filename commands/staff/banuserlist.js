const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class banuserlistCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'banuserlist',
      group: 'staff',
      memberName: 'banuserlist',
      description: 'Shows you a list of all Discord users banned by the bot',
      format: 'banuserlist',
      aliases: [],
      examples: ['banuserlist'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Banuser',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const role = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator');
    if (!role || !msg.member.roles.has(role.id)) return msg.reply(lang.botownercommands_error);

    const blacklist = [];

    if (msg.client.provider.getBotsettings('botconfs', 'blacklist').length === 0) return msg.reply(lang.banuserlist_error);

    const embedfooter = lang.banuserlist_embedfooter.replace('%prefix', prefix).replace('%prefix', prefix);
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle(lang.banuserlist_embedtitle)
      .setFooter(embedfooter);

    if (msg.client.provider.getBotsettings('botconfs', 'blacklist').length < 1) return msg.channel.send('There are no banned Discord users!');
    for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'blacklist').length; i += 1) {
      blacklist.push(msg.client.provider.getBotsettings('botconfs', 'blacklist')[i]);
    }
    blacklist.forEach((r) => embed.addField(`${r.userID}`, lang.banuserlist_embedfield.replace('%moderatortag', msg.client.users.has(r.moderator) ? msg.client.users.get(r.moderator).tag : r.moderator).replace('%reason', r.reason)));

    await msg.channel.send({
      embed
    });
  }
};
