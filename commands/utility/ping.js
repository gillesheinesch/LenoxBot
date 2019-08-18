const LenoxCommand = require('../LenoxCommand.js');

module.exports = class pingCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'ping',
      group: 'utility',
      memberName: 'ping',
      description: 'Shows you how long the bot needs to send a message',
      format: 'ping',
      aliases: [],
      examples: ['ping'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Information',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const message = await msg.channel.send('Ping?');
    const newmsg = lang.ping_ping.replace('%latency', message.createdTimestamp - msg.createdTimestamp).replace('%latencyapi', Math.round(msg.client.ws.ping));
    message.edit(newmsg);
  }
};
