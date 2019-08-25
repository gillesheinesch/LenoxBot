const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class unbanserverCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'unbanserver',
      group: 'staff',
      memberName: 'unbanserver',
      description: 'Removes a Discord Server from the banlist',
      format: 'unbanserver {guildid} {reason}',
      aliases: [],
      examples: ['unbanserver 352896116812939264 Mistake'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Banserver',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const role = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator');
    if (!role || !msg.member.roles.has(role.id)) return msg.reply(lang.botownercommands_error);

    const guildId = args.slice(0, 1).join(' ');

    if (!guildId || isNaN(guildId)) return msg.reply(lang.unbanserver_noguildid);
    if (args.slice(1).length === 0) return msg.reply(lang.unbanserver_noreason);

    for (let i = 0; i < msg.client.provider.getBotsettings('botconfs', 'banlist').length; i += 1) {
      if (msg.client.provider.getBotsettings('botconfs', 'banlist')[i].discordServerID === guildId) {
        const embedtitle = lang.unbanserver_embedtitle.replace('%guildid', guildId);
        const embeddescription = lang.unbanserver_embeddescription.replace('%moderatortag', msg.author.tag).replace('%moderatorid', msg.author.id).replace('%reason', args.slice(1).join(' '));
        const embed = new Discord.MessageEmbed()
          .setColor('GREEN')
          .setTimestamp()
          .setTitle(embedtitle)
          .setDescription(embeddescription);

        await msg.client.channels.get('497395598182318100').send({
          embed
        });

        const currentBanlist = msg.client.provider.getBotsettings('botconfs', 'banlist');
        currentBanlist.splice(i, 1);
        await msg.client.provider.setBotsettings('botconfs', 'banlist', currentBanlist);

        return msg.reply(lang.unbanserver_unbanned);
      }
    }
    return msg.reply(lang.unbanserver_notbanned);
  }
};
