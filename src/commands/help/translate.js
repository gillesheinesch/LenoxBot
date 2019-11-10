const LenoxCommand = require('../LenoxCommand.js');

module.exports = class translateCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'translate',
      group: 'help',
      memberName: 'translate',
      description: 'Gives you informations about our translation project',
      format: 'translate',
      aliases: [],
      examples: ['translate'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Help',
      dashboardsettings: true
    });
  }

  run(msg) {
    const Discord = require('discord.js');
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);


    const translateEmbed = new Discord.MessageEmbed()
      .setTitle(lang.translate_embedtitle)
      .setDescription(lang.translate_embeddescription)
      .addField(lang.translate_embedfieldtitle, 'https://crowdin.com/project/lenoxbot')
      .setURL('https://crowdin.com/project/lenoxbot')
      .setColor('BLUE');

    msg.channel.send({
      embed: translateEmbed
    });
  }
};
