const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class listmodulesCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'listmodules',
      group: 'administration',
      memberName: 'listmodules',
      description: 'Lists all active/disabled modules',
      format: 'listmodules',
      aliases: [],
      examples: ['listmodules'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Modules',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const embed = new Discord.MessageEmbed()
      .setColor('0066CC')
      .setAuthor(lang.listmodules_embed);

    const disabledmodules = [];
    const activatedmodules = [];

    for (const i in msg.client.provider.getGuild(msg.guild.id, 'modules')) {
      if (msg.client.provider.getGuild(msg.guild.id, 'modules')[i] === 'false') {
        disabledmodules.push(i);
      }
      else {
        activatedmodules.push(i);
      }
    }

    embed.addField(lang.listmodules_activemodules, activatedmodules.length === 0 ? lang.listmodules_noactivemodules : activatedmodules.join('\n'));
    embed.addField(lang.listmodules_disabledmodules, disabledmodules.length === 0 ? lang.listmodules_nodisabledmodules : disabledmodules.join('\n'));

    msg.channel.send({ embed });
  }
};
