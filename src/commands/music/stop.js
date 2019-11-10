const LenoxCommand = require('../LenoxCommand.js');

module.exports = class stopCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'stop',
      group: 'music',
      memberName: 'stop',
      description: 'Stops the current music and the bot leaves the voice channel',
      format: 'stop',
      aliases: [],
      examples: ['stop'],
      clientpermissions: ['SEND_MESSAGES', 'SPEAK'],
      userpermissions: ['MANAGE_GUILD'],
      shortDescription: 'Musicplayersettings',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const { queue } = msg.client;
    const serverQueue = queue.get(msg.guild.id);
    if (!msg.member.voice.channel) return msg.channel.send(lang.stop_notvoicechannel);
    if (!serverQueue) return msg.channel.send(lang.stop_notvoicechannel);
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    return msg.channel.send(lang.stop_leftchannel);
  }
};
