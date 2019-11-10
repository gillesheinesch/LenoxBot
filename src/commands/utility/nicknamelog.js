const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class nicknamelogCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'nicknamelog',
      group: 'utility',
      memberName: 'nicknamelog',
      description: 'Shows you the nickname log of you or a user',
      format: 'nicknamelog [@User]',
      aliases: [],
      examples: ['nicknamelog', 'nicknamelog @Monkeyyy11#7584'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const mention = msg.mentions.users.first() || msg.author;
    const dateArray = [];
    const oldnickname = [];
    const newnickname = [];

    if (msg.client.provider.getGuild(msg.guild.id, 'nicknamelog').length === 0) return msg.channel.send(lang.nicknamelog_error);

    const array = [];
    for (let i = 0; i < msg.client.provider.getGuild(msg.guild.id, 'nicknamelog').length; i += 4) {
      if (mention.id === msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i]) {
        array.push(true);
        oldnickname.push(msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i + 1].length > 17 ? `${msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i + 1].substring(0, 17)}...` : msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i + 1]);
        newnickname.push(msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i + 2].length > 17 ? `${msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i + 2].substring(0, 17)}...` : msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i + 2]);
        dateArray.push(new Date(msg.client.provider.getGuild(msg.guild.id, 'nicknamelog')[i + 3]).toLocaleString());
      }
    }

    if (array.length === 0) return msg.channel.send(lang.nicknamelog_nonicknamelog);

    const embed = new Discord.MessageEmbed()
      .setAuthor(`${mention.username}#${mention.discriminator}`)
      .setColor('#ccff33')
      .addField(lang.nicknamelog_old, oldnickname.slice(0, 20).join('\n'), true)
      .addField(lang.nicknamelog_new, newnickname.slice(0, 20).join('\n'), true)
      .addField(lang.nicknamelog_changedat, dateArray.slice(0, 20).join('\n'), true);

    const message = await msg.channel.send({
      embed
    });

    await message.react('◀');
    await message.react('▶');

    let first = 0;
    let second = 20;

    const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
      time: 30000
    });
    collector.on('collect', (r) => {
      const reactionadd = oldnickname.slice(first + 20, second + 20).length;
      const reactionremove = oldnickname.slice(first - 20, second - 20).length;

      if (r.emoji.name === '▶' && reactionadd !== 0) {
        const newDateArray = dateArray.slice(first + 20, second + 20);
        const newOldNickname = oldnickname.slice(first + 20, second + 20);
        const newNewNickname = newnickname.slice(first + 20, second + 20);

        first += 20;
        second += 20;

        const newembed = new Discord.MessageEmbed()
          .setAuthor(`${mention.username}#${mention.discriminator}`)
          .setColor('#ccff33')
          .addField(lang.nicknamelog_old, newOldNickname.join('\n'), true)
          .addField(lang.nicknamelog_new, newNewNickname.join('\n'), true)
          .addField(lang.nicknamelog_changedat, newDateArray.join('\n'), true);

        message.edit({
          embed: newembed
        });
      }
      else if (r.emoji.name === '◀' && reactionremove !== 0) {
        const newDateArray = dateArray.slice(first - 20, second - 20);
        const newOldNickname = oldnickname.slice(first - 20, second - 20);
        const newNewNickname = newnickname.slice(first - 20, second - 20);

        first -= 20;
        second -= 20;

        const newembed = new Discord.MessageEmbed()
          .setAuthor(`${mention.username}#${mention.discriminator}`)
          .setColor('#ccff33')
          .addField(lang.nicknamelog_old, newOldNickname.join('\n'), true)
          .addField(lang.nicknamelog_new, newNewNickname.join('\n'), true)
          .addField(lang.nicknamelog_changedat, newDateArray.join('\n'), true);

        message.edit({
          embed: newembed
        });
      }
    });
    collector.on('end', () => {
      message.react('❌');
    });
  }
};
