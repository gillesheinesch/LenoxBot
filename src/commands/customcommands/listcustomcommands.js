const LenoxCommand = require('../LenoxCommand.js');

module.exports = class listcustomcommandsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'listcustomcommands',
      group: 'customcommands',
      memberName: 'listcustomcommands',
      description: 'Lists all custom commands',
      format: 'listcustomcommands',
      aliases: ['lcc'],
      examples: ['listcustomcommands'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Customcommands',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const Discord = require('discord.js');
    const arrayOfCustomCommands = [];

    if (msg.client.provider.getGuild(msg.guild.id, 'customcommands').length === 0) return msg.reply(lang.listcustomcommands_nocustommcommands);

    const embed = new Discord.MessageEmbed()
      .setColor('#ff9900');

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'customcommands').length; i += 1) {
      arrayOfCustomCommands.push(`${prefix}${msg.client.provider.getGuild(msg.guild.id, 'customcommands')[i].name}`);
    }

    embed.addField(lang.listcustomcommands_embedtitle, arrayOfCustomCommands.slice(0, 15).join('\n'));

    const message = await msg.channel.send({
      embed
    });

    if (arrayOfCustomCommands.length <= 15) return;

    const reaction1 = await message.react('◀');
    const reaction2 = await message.react('▶');

    let first = 0;
    let second = 15;

    const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
      time: 120000
    });
    collector.on('collect', (r) => {
      const reactionadd = arrayOfCustomCommands.slice(first + 15, second + 15).length;
      const reactionremove = arrayOfCustomCommands.slice(first - 15, second - 15).length;

      if (r.emoji.name === '▶' && reactionadd !== 0) {
        r.users.remove(msg.author.id);

        first += 15;
        second += 15;

        const newembed = new Discord.MessageEmbed()
          .setColor('#ff9900');

        newembed.addField(lang.listcustomcommands_embedtitle, arrayOfCustomCommands.slice(first, second).join('\n'), true);

        message.edit({
          embed: newembed
        });
      }
      else if (r.emoji.name === '◀' && reactionremove !== 0) {
        r.users.remove(msg.author.id);

        first -= 15;
        second -= 15;

        const newembed = new Discord.MessageEmbed()
          .setColor('#ff9900');

        newembed.addField(lang.listcustomcommands_embedtitle, arrayOfCustomCommands.slice(first, second).join('\n'), true);

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
