const LenoxCommand = require('../LenoxCommand.js');

module.exports = class resumeCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'resume',
      group: 'music',
      memberName: 'resume',
      description: 'Continues the current music',
      format: 'resume',
      aliases: [],
      examples: ['resume'],
      clientpermissions: ['SEND_MESSAGES', 'SPEAK'],
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
    if (serverQueue && !serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return msg.channel.send(lang.resume_resumed);
    }
    return msg.channel.send(lang.resume_nothing);
  }
};
