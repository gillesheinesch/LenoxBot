const LenoxCommand = require('../LenoxCommand.js');

module.exports = class modulesCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'modules',
      group: 'help',
      memberName: 'modules',
      description: 'Gives you a list of all modules and their meaning',
      format: 'modules',
      aliases: ['m'],
      examples: ['modules'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Help',
      dashboardsettings: false
    });
  }

  run(msg) {
    const Discord = require('discord.js');
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');

    const commandscommand = lang.modules_commandscommand.replace('%prefix', prefix);
    const embed = new Discord.MessageEmbed()
      .setFooter(commandscommand)
      .setColor('0066CC')
      .addField('Administration', lang.modules_administration)
      .addField('Moderation', lang.modules_moderation)
      .addField('Help', lang.modules_help)
      .addField('Music', lang.modules_music)
      .addField('Fun', lang.modules_fun)
      .addField('Searches', lang.modules_searches)
      .addField('NSFW', lang.modules_nsfw)
      .addField('Utility', lang.modules_utility)
      .addField('Application', lang.modules_application)
      .addField('Currency', lang.modules_currency)
      .addField('Tickets', lang.modules_tickets)
      .addField('Customcommands', lang.modules_customcommands)
      .setTitle(lang.modules_embed);

    msg.channel.send({ embed });
  }
};
