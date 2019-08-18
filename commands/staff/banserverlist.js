const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class banserverlistCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'banserverlist',
      group: 'staff',
      memberName: 'banserverlist',
      description: 'Shows you a list of all Discord servers banned by the bot',
      format: 'banserverlist',
      aliases: [],
      examples: ['banserverlist'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Banserver',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    const lang = require(`../../languages/${langSet}.json`);

    const role = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator');
    if (!role || !msg.member.roles.has(role.id)) return msg.reply(lang.botownercommands_error);

    const banlist = [];

    if (msg.client.provider.getBotsettings('botconfs', 'banlist').length === 0) return msg.reply(lang.banserverlist_error);

    const embedfooter = lang.banserverlist_embedfooter.replace('%prefix', prefix);
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTitle(lang.banserverlist_embedtitle)
      .setFooter(embedfooter);

    for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'banlist').length; i += 1) {
      banlist.push(msg.client.provider.getBotsettings('botconfs', 'banlist')[i]);
    }
    banlist.forEach((r) => embed.addField(`${r.discordServerID}`, lang.banserverlist_embedfield.replace('%moderatortag', msg.client.users.has(r.moderator) ? msg.client.users.get(r.moderator).tag : r.moderator).replace('%reason', r.reason)));

    await msg.channel.send({
      embed
    });
  }
};
