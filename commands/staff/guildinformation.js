const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class guildinformationCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'guildinformation',
      group: 'staff',
      memberName: 'guildinformation',
      description: 'Allows the staff of the bot to find out main informations of a Discord server',
      format: 'guildinformation {guildid} {reason}',
      aliases: [],
      examples: ['guildinformation 352896116812939264 Server owner doesn\'t know prefix anymore'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const role = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator');
    if (!role || !msg.member.roles.has(role.id)) return msg.reply(lang.botownercommands_error);

    const content = args.slice(0, 1);
    if (!content || isNaN(content)) return msg.reply(lang.guildinformation_noguildid);

    const reason = args.slice(1);
    if (!reason || !reason.length) return msg.reply(lang.guildinformation_noreason);

    if (!msg.client.provider.getGuild(content.join(' '))) return msg.reply(lang.guildinformation_nofetch);

    const guildload = msg.client.guilds.get(content.join(' '));
    const requestedby = lang.guildinformation_requestedby.replace('%authortag', msg.author.tag);
    const embeddescription = lang.guildinformation_embeddescription.replace('%reason', reason);
    const embed = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setThumbnail(guildload.iconURL())
      .setDescription(embeddescription)
      .addField(lang.guildinformation_embedfield1, `${guildload.owner.user.tag} (${guildload.owner.id})`)
      .addField(lang.guildinformation_embedfield2, msg.client.provider.getGuild(msg.guild.id, 'prefix'))
      .addField(lang.guildinformation_embedfield3, msg.client.provider.getGuild(msg.guild.id, 'language'))
      .addField(lang.guildinformation_embedfield4, msg.client.provider.getGuild(msg.guild.id, 'premium').status ? lang.guildinformation_embedfield4answer2 : lang.guildinformation_embedfield4answer1)
      .setFooter(requestedby)
      .setAuthor(`${guildload.name} (${guildload.id})`);

    await msg.client.channels.get('497395598182318100').send({ embed });

    return msg.reply('Request successful received!');
  }
};
