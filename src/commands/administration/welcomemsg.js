const LenoxCommand = require('../LenoxCommand.js');

module.exports = class welcomemsgCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'welcomemsg',
      group: 'administration',
      memberName: 'welcomemsg',
      description: 'Sets a welcome message to greet your users',
      format: 'welcomemsg {welcome msg}',
      aliases: [],
      examples: ['welcomemsg Hello $username$, welcome on the $servername$ discord-server!'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Welcome',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const content = args.slice().join(' ');

    if (!content) return msg.channel.send(lang.welcomemsg_error);

    await msg.client.provider.setGuild(msg.guild.id, 'welcomemsg', content);

    return msg.channel.send(lang.welcomemsg_set);
  }
};
