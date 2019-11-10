const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class queueCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'Plays a music playlist',
      format: 'queue',
      aliases: [],
      examples: ['queue'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Queue',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const { queue } = msg.client;
    const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue || serverQueue.songs.length === 0) return msg.channel.send(lang.queue_nothing);

    const nowplaying = lang.queue_nowplaying.replace('%songtitle', serverQueue.songs[0].title);
    const songqueue = lang.queue_songqueue.replace('%songtitle', serverQueue.songs[0].title);
    const queueEmbed = new Discord.MessageEmbed()
      .setColor('#009696')
      .setDescription(`${serverQueue.songs.slice(0, 15).map((song) => `**-** ${song.title}`).join('\n')}
		\n**${nowplaying}**`)
      .setAuthor(songqueue, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');

    const message = await msg.channel.send({
      embed: queueEmbed
    });

    if (serverQueue.songs.length > 15) {
      const reaction1 = await message.react('◀');
      const reaction2 = await message.react('▶');

      let first = 0;
      let second = 15;

      const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
        time: 120000
      });
      collector.on('collect', (r) => {
        const reactionadd = serverQueue.songs.slice(first + 15, second + 15).length;
        const reactionremove = serverQueue.songs.slice(first - 15, second - 15).length;

        if (r.emoji.name === '▶' && reactionadd !== 0) {
          r.users.remove(msg.author.id);

          first += 15;
          second += 15;

          const newEmbed = new Discord.MessageEmbed()
            .setColor('#009696')
            .setAuthor(songqueue, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');

          newEmbed.setDescription(`${serverQueue.songs.slice(first, second).map((song) => `**-** ${song.title}`).join('\n')}
					\n**${nowplaying}**`);

          message.edit({
            embed: newEmbed
          });
        }
        else if (r.emoji.name === '◀' && reactionremove !== 0) {
          r.users.remove(msg.author.id);

          first -= 15;
          second -= 15;

          const newEmbed = new Discord.MessageEmbed()
            .setColor('#009696')
            .setAuthor(songqueue, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');

          newEmbed.setDescription(`${serverQueue.songs.slice(first, second).map((song) => `**-** ${song.title}`).join('\n')}
					\n**${nowplaying}**`);

          message.edit({
            embed: newEmbed
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
