const LenoxCommand = require('../LenoxCommand.js');

module.exports = class volumeCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'volume',
      group: 'music',
      memberName: 'volume',
      description: 'Changes the volume of the bot',
      format: 'volume {1-5}',
      aliases: [],
      examples: ['volume 3'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Musicplayersettings',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const { queue } = msg.client;
    const serverQueue = queue.get(msg.guild.id);
    const volumeinput = msg.content.split(' ');

    if (msg.client.provider.getGuild(msg.guild.id, 'premium').status === false && msg.client.provider.getUser(msg.author.id, 'premium').status === false) return msg.reply(lang.volume_nopremium);

    if (!msg.member.voice.channel) return msg.channel.send(lang.volume_notvoicechannel);
    if (!serverQueue) return msg.channel.send(lang.volume_nothing);
    const currentvolume = lang.volume_currentvolume.replace('%volume', serverQueue.volume);
    if (!volumeinput[1]) return msg.channel.send(currentvolume);
    if (volumeinput > 5) return msg.channel.send(lang.volume_error);

    serverQueue.volume = volumeinput[1];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(volumeinput[1] / 5);

    const volumeset = lang.volume_volumeset.replace('%volumeinput', volumeinput[1]);
    return msg.channel.send(volumeset);
  }
};
