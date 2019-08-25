const LenoxCommand = require('../LenoxCommand.js');

module.exports = class setchanneltopicCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'setchanneltopic',
      group: 'administration',
      memberName: 'setchanneltopic',
      description: 'Sets a new channel topic for the current channel',
      format: 'setchanneltopic {New channeltopic}',
      aliases: [],
      examples: ['setchanneltopic Hello World'],
      clientpermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS'],
      userpermissions: ['MANAGE_CHANNELS'],
      shortDescription: 'Selfassignableroles',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const input = args.slice();

    if (input.length === 0) return msg.channel.send(lang.setchanneltopic_error);

    await msg.channel.setTopic(input.join(' '));

    const set = lang.setchanneltopic_set.replace('%channelname', msg.channel.name);
    msg.channel.send(set);
  }
};
