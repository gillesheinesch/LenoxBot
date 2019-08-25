const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class listchatfilterCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'listchatfilter',
      group: 'administration',
      memberName: 'listchatfilter',
      description: 'Lists all auto assignable roles',
      format: 'listchatfilter',
      aliases: [],
      examples: ['listchatfilter'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Chatfilter',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const array = [];

    if (!msg.client.provider.getGuild(msg.guild.id, 'chatfilter')) {
      await msg.client.provider.setGuild(msg.guild.id, 'chatfilter', {
        chatfilter: 'false',
        array: []
      });
    }

    if (msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array.length === 0) return msg.channel.send(lang.listchatfilter_error);

    const embed = new Discord.MessageEmbed()
      .setColor('#ABCDEF');

    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array.length; i += 1) {
      array.push(msg.client.provider.getGuild(msg.guild.id, 'chatfilter').array[i]);
    }

    embed.addField(lang.listchatfilter_embed, array.slice(0, 15).join('\n'), true);

    const message = await msg.channel.send({
      embed
    });

    if (array.length > 15) {
      const reaction1 = await message.react('◀');
      const reaction2 = await message.react('▶');

      let first = 0;
      let second = 15;

      const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
        time: 120000
      });
      collector.on('collect', (r) => {
        const reactionadd = array.slice(first + 15, second + 15).length;
        const reactionremove = array.slice(first - 15, second - 15).length;

        if (r.emoji.name === '▶' && reactionadd !== 0) {
          r.users.remove(msg.author.id);

          first += 15;
          second += 15;

          const newembed = new Discord.MessageEmbed()
            .setColor('#ABCDEF');

          newembed.addField(lang.listchatfilter_embed, array.slice(first, second).join('\n'), true);

          message.edit({
            embed: newembed
          });
        }
        else if (r.emoji.name === '◀' && reactionremove !== 0) {
          r.users.remove(msg.author.id);

          first -= 15;
          second -= 15;

          const newembed = new Discord.MessageEmbed()
            .setColor('#ABCDEF');

          newembed.addField(lang.listchatfilter_embed, array.slice(first, second).join('\n'), true);

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
  }
};
