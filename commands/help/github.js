const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class githubCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'github',
      group: 'help',
      memberName: 'github',
      description: 'All details about our GitHub Repository of LenoxBot',
      format: 'github',
      aliases: [],
      examples: ['github'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Help',
      dashboardsettings: false
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const embed = new Discord.MessageEmbed()
      .setTitle(lang.github_embedtitle)
      .setURL('https://github.com/LenoxBot')
      .setColor('BLUE')
      .setDescription(lang.github_embeddescription)
      .addField(lang.github_fieldtitlecontribute, lang.github_fielddescriptioncontribute)
      .addField(lang.github_fieldtitlelink, 'https://github.com/LenoxBot');

    return msg.channel.send({
      embed
    });
  }
};
