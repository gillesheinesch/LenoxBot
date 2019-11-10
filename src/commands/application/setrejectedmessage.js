const LenoxCommand = require('../LenoxCommand.js');

module.exports = class setrejectedmessageCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'setrejectedmessage',
      group: 'application',
      memberName: 'setrejectedmessage',
      description: 'Sets a custom message that receive the applicants who have been rejected',
      format: 'setrejectedmessage {custom message}',
      aliases: [],
      examples: ['setrejectedmessage You have been rejected!'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Settings',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const content = args.slice().join(' ');
    if (!content) return msg.channel.send(lang.setacceptedmessage_noinput);

    const currentApplication = msg.client.provider.getGuild(msg.guild.id, 'application');
    currentApplication.rejectedmessage = content;
    await msg.client.provider.setGuild(msg.guild.id, 'application', currentApplication);

    return msg.channel.send(lang.setacceptedmessage_set);
  }
};
