const LenoxCommand = require('../LenoxCommand.js');

module.exports = class voteCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'vote',
      group: 'help',
      memberName: 'vote',
      description: 'All details about voting for LenoxBot',
      format: 'vote',
      aliases: [],
      examples: ['vote'],
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


    const embeddescription = lang.vote_embeddescription.replace('%link', 'https://discordbots.org/bot/lenoxbot/vote');
    const embed = new Discord.MessageEmbed()
      .setAuthor(lang.vote_embedauthor)
      .setColor('BLUE')
      .setDescription(embeddescription);

    return msg.channel.send({
      embed
    });
  }
};
