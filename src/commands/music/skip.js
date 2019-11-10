const LenoxCommand = require('../LenoxCommand.js');

module.exports = class skipCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'skip',
      group: 'music',
      memberName: 'skip',
      description: 'Allows the users to skip a song with a poll',
      format: 'skip',
      aliases: [],
      examples: ['skip'],
      clientpermissions: ['SEND_MESSAGES', 'SPEAK'],
      userpermissions: [],
      shortDescription: 'Skip',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const { queue } = msg.client;
    const serverQueue = queue.get(msg.guild.id);

    if (msg.client.provider.getGuild(msg.guild.id, 'skipvote') === 'false') return msg.channel.send(lang.skip_skipvotedeativated);
    if (!msg.member.voice.channel) return msg.channel.send(lang.skip_notvoicechannel);
    if (!serverQueue) return msg.channel.send(lang.skip_nothing);

    if (msg.member.voice.channel.members.size === 2) {
      msg.channel.send(lang.skip_skippedalone);
      await serverQueue.connection.dispatcher.end();
      return;
    }

    const map = msg.client.skipvote;

    const mapload = map.get(msg.guild.id);
    if (mapload.users.includes(msg.author.id)) return msg.channel.send(lang.skip_alreadyvoted);

    mapload.users.push(msg.author.id);
    await map.set(msg.guild.id, mapload);

    if (!msg.client.provider.getGuild(msg.guild.id, 'skipvote')) {
      await msg.client.provider.setGuild(msg.guild.id, 'skipvote', 1);
    }

    if (mapload.users.length === 1) {
      const newvote = lang.skip_newvote.replace('%author', msg.author).replace('%skipnumber', msg.client.provider.getGuild(msg.guild.id, 'skipnumber'));
      msg.channel.send(newvote);
    }

    if (mapload.users.length > 1) {
      const vote = lang.skip_vote.replace('%author', msg.author).replace('%currentvotes', mapload.users.length).replace('%skipnumber', msg.client.provider.getGuild(msg.guild.id, 'skipnumber'));
      msg.channel.send(vote);
    }

    const number = parseInt(msg.client.provider.getGuild(msg.guild.id, 'skipnumber'), 10);

    if (mapload.users.length !== number) return;

    msg.channel.send(lang.skip_skipped);
    await serverQueue.connection.dispatcher.end();
  }
};
