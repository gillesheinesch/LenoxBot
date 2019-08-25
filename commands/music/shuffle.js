const LenoxCommand = require('../LenoxCommand.js');

module.exports = class shuffleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      group: 'music',
      memberName: 'shuffle',
      description: 'Shuffle the queue',
      format: 'shuffle',
      aliases: [],
      examples: ['shuffle'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Shuffle',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const shuffle = (a) => a.reduce((l, e, i) => {
      const j = Math.floor(Math.random() * (a.length - i) + i);
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    }, a);
    const fixedAllDifferentShuffle = (a, f) => {
      // memorize position of fixed elements
      const fixed = a.reduce((acc, e, i) => {
        if (f[i]) acc.push([e, i]);
        return acc;
      }, []);
      a = shuffle(a);
      // swap fixed elements back to their original position
      fixed.forEach(([item, initialIndex]) => {
        const currentIndex = a.indexOf(item);
        [a[initialIndex], a[currentIndex]] = [a[currentIndex], a[initialIndex]];
      });
      return a;
    };
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const { queue } = msg.client;
    const serverQueue = queue.get(msg.guild.id);

    if (!msg.member.voice.channel) return msg.channel.send(lang.shuffle_notvoicechannel);
    if (!serverQueue || !serverQueue.songs.length) return msg.channel.send(lang.shuffle_nothing);

    serverQueue.songs = fixedAllDifferentShuffle(serverQueue.songs, [true]);

    msg.channel.send(lang.shuffle_shuffled);
  }
};
