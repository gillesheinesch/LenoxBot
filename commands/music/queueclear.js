const LenoxCommand = require('../LenoxCommand.js');

module.exports = class queueclearCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'queueclear',
      group: 'music',
      memberName: 'queueclear',
      description: 'Clears the whole music queue',
      format: 'queueclear',
      aliases: [],
      examples: ['queueclear'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['MANAGE_GUILD'],
      shortDescription: 'Queue',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const { queue } = msg.client;
    const serverQueue = queue.get(msg.guild.id);

    if (!serverQueue || serverQueue.songs.length === 1) return msg.channel.send(lang.queueclear_queueempty);

    serverQueue.songs = [];
    return msg.reply(lang.queueclear_done);
  }
};
