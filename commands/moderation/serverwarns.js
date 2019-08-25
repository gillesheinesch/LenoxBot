const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class serverwarnsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'serverwarns',
      group: 'moderation',
      memberName: 'serverwarns',
      description: 'Shows you all given warns on this Discord Server',
      format: 'serverwarns',
      aliases: [],
      examples: ['serverwarns'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['KICK_MEMBERS'],
      shortDescription: 'Warn',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (!msg.client.provider.getGuild(msg.guild.id, 'warnlog')) return msg.reply(lang.serverwarns_erroroldsystem);

    if (msg.client.provider.getGuild(msg.guild.id, 'warnlog').length === 0) return msg.channel.send(lang.serverwarns_error);
    const firstfield = [];
    const secondfield = [];
    const array = [];
    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'warnlog').length; i += 4) {
      array.push(true);
      const member = msg.guild.member(msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i + 3]) ? msg.guild.member(msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i + 3]).displayName : msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i + 3];
      const member2 = msg.guild.member(msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i]) ? msg.guild.member(msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i]).displayName : msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i];
      const warnedbyandon = lang.serverwarns_warnedbyandon.replace('%membername', member).replace('%date', new Date(msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i + 1])).replace('%username', member2);
      firstfield.push(warnedbyandon);
      secondfield.push(`${lang.serverwarns_reason} ${msg.client.provider.getGuild(msg.guild.id, 'warnlog')[i + 2]}`);
    }
    const embed = new Discord.MessageEmbed()
      .setColor('#fff024')
      .setAuthor(msg.guild.name, msg.guild.iconURL());
    const x = firstfield.slice(0, 5);
    const xx = secondfield.slice(0, 5);
    for (let i = 0; i < x.length; i += 1) {
      embed.addField(x[i], xx[i]);
    }
    const message = await msg.channel.send({
      embed
    });
    if (msg.client.provider.getGuild(msg.guild.id, 'warnlog').length / 4 <= 5) return undefined;
    const reaction1 = await message.react('◀');
    const reaction2 = await message.react('▶');
    let first = 0;
    let second = 5;
    const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
      time: 30000
    });
    collector.on('collect', (r) => {
      const reactionadd = firstfield.slice(first + 5, second + 5).length;
      const reactionremove = firstfield.slice(first - 5, second - 5).length;
      if (r.emoji.name === '▶' && reactionadd !== 0) {
        r.users.remove(msg.author.id);
        const thefirst = firstfield.slice(first + 5, second + 5);
        const thesecond = secondfield.slice(first + 5, second + 5);
        first += 5;
        second += 5;
        const newembed = new Discord.MessageEmbed()
          .setColor('#fff024')
          .setAuthor(msg.guild.name, msg.guild.iconURL());
        for (let i = 0; i < thefirst.length; i += 1) {
          newembed.addField(thefirst[i], thesecond[i]);
        }
        message.edit({
          embed: newembed
        });
      }
      else if (r.emoji.name === '◀' && reactionremove !== 0) {
        r.users.remove(msg.author.id);
        const thefirst = firstfield.slice(first - 5, second - 5);
        const thesecond = secondfield.slice(first - 5, second - 5);
        first -= 5;
        second -= 5;
        const newembed = new Discord.MessageEmbed()
          .setColor('#fff024')
          .setAuthor(msg.guild.name, msg.guild.iconURL());
        for (let i = 0; i < thefirst.length; i += 1) {
          newembed.addField(thefirst[i], thesecond[i]);
        }
        message.edit({
          embed: newembed
        });
      }
    });
    collector.on('end', () => {
      reaction1.users.remove();
      reaction2.users.remove();
    });
  }
};
