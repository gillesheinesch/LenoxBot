const LenoxCommand = require('../LenoxCommand.js');

module.exports = class forceskipCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'forceskip',
      group: 'music',
      memberName: 'forceskip',
      description: 'Forces the bot to skip the current song without a poll!',
      format: 'forceskip',
      aliases: [],
      examples: ['forceskip'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['MANAGE_GUILD'],
      shortDescription: 'Skip',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const { queue } = msg.client;
    const serverQueue = queue.get(msg.guild.id);
    if (!msg.member.voice.channel) return msg.channel.send(lang.forceskip_notvoicechannel);
    if (!serverQueue) return msg.channel.send(lang.forceskip_noserverqueue);
    await serverQueue.connection.dispatcher.end();
  }
};
