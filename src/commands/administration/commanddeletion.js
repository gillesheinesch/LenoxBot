const LenoxCommand = require('../LenoxCommand.js');

module.exports = class commanddeletionCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'commanddeletion',
      group: 'administration',
      memberName: 'commanddeletion',
      description: 'Toggles the deletion of a command after execution',
      format: 'commanddeletion',
      aliases: ['cmddel'],
      examples: ['commanddeletion'],
      category: 'administration',
      clientpermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (msg.client.provider.getGuild(msg.guild.id, 'commanddel') === 'false') {
      let currentCommanddel = msg.client.provider.getGuild(msg.guild.id, 'commanddel');
      currentCommanddel = 'true';
      await msg.client.provider.setGuild(msg.guild.id, 'commanddel', currentCommanddel);

      return msg.channel.send(lang.commanddeletion_deletionset);
    }
    let currentCommanddel = msg.client.provider.getGuild(msg.guild.id, 'commanddel');
    currentCommanddel = 'false';
    await msg.client.provider.setGuild(msg.guild.id, 'commanddel', currentCommanddel);

    return msg.channel.send(lang.commanddeletion_nodeletionset);
  }
};
