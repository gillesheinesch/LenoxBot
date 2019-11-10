const LenoxCommand = require('../LenoxCommand.js');

module.exports = class byemsgCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'byemsg',
      group: 'administration',
      memberName: 'byemsg',
      description: 'Sets a goodbye message to say goodbye to your users',
      format: 'byemsg {goodbye message}',
      aliases: [],
      examples: ['byemsg Bye $user$, we gonna miss you on the $servername$ discord-server!'],
      category: 'administration',
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Bye',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const content = args.slice().join(' ');
    if (!content) return msg.channel.send(lang.byemsg_noinput);

    let currentByemsg = msg.client.provider.getGuild(msg.guild.id, 'byemsg');
    currentByemsg = content;
    await msg.client.provider.setGuild(msg.guild.id, 'byemsg', currentByemsg);

    return msg.channel.send(lang.byemsg_goodbyemsgset);
  }
};
