const LenoxCommand = require('../LenoxCommand.js');

module.exports = class ranksCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'ranks',
      group: 'utility',
      memberName: 'ranks',
      description: 'Ranking list, sorted by points',
      format: 'ranks',
      aliases: [],
      examples: ['ranks'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'XP',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const message = lang.ranks_message.replace('%id', msg.guild.id).replace('%guildname', msg.guild.name);
    msg.reply(message);
  }
};
