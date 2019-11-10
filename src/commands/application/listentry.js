const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class listentryCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'listentry',
      group: 'application',
      memberName: 'listentry',
      description: 'Shows all entries that exist in the template',
      format: 'listentry',
      aliases: [],
      examples: ['listentry'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Entries',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (msg.client.provider.getGuild(msg.guild.id, 'application').template.length === 0) return msg.reply(lang.listentry_error);

    const templates = [];

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'application').template.length; i += 1) {
      templates.push(`\`${i + 1}.\` ${msg.client.provider.getGuild(msg.guild.id, 'application').template[i]}`);
    }

    const embed = new Discord.MessageEmbed()
      .setColor('#ABCDEF');
    embed.addField(lang.listentry_current, templates.slice(0, 10).join('\n'), true);
    const message = await msg.channel.send({
      embed
    });

    if (templates.length <= 10) return;
    const reaction1 = await message.react('◀');
    const reaction2 = await message.react('▶');

    let first = 0;
    let second = 10;

    const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
      time: 120000
    });
    collector.on('collect', (r) => {
      const reactionadd = templates.slice(first + 10, second + 10).length;
      const reactionremove = templates.slice(first - 10, second - 10).length;

      if (r.emoji.name === '▶' && reactionadd !== 0) {
        r.users.remove(msg.author.id);

        first += 10;
        second += 10;

        const newembed = new Discord.MessageEmbed()
          .setColor('#ABCDEF');

        newembed.addField(lang.listentry_current, templates.slice(first, second).join('\n'), true);

        message.edit({
          embed: newembed
        });
      }
      else if (r.emoji.name === '◀' && reactionremove !== 0) {
        r.users.remove(msg.author.id);

        first -= 10;
        second -= 10;

        const newembed = new Discord.MessageEmbed()
          .setColor('#ABCDEF');

        newembed.addField(lang.listentry_current, templates.slice(first, second).join('\n'), true);

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
