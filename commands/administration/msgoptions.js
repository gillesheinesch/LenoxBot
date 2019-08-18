const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class msgoptionsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'msgoptions',
      group: 'administration',
      memberName: 'msgoptions',
      description: 'Shows you a list of all available options for your welcome and bye msg',
      format: 'msgoptions',
      aliases: [],
      examples: ['msgoptions'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const validation = ['$usertag$', '$usermention$', '$username$', '$userid$', '$guildname$', '$guildid$'];

    const embed = new Discord.MessageEmbed()
      .setColor('#7FFFD4')
      .setAuthor(lang.msgoptions_embed);

    for (let i = 0; i < validation.length; i += 1) {
      embed.addField(validation[i], lang[`msgoptions_${validation[i]}`]);
    }

    msg.channel.send({
      embed
    });
  }
};
