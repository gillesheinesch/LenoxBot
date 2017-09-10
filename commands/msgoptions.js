const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    const embed = new Discord.RichEmbed()
    .setColor('#7FFFD4')
    .setDescription('$username$ = Username of the new member \n$userid$ = UserID of the new member \n$guildname$ = the name of this guild \n$guildid$ = the id of this guild')
    .setAuthor('Welcome/Bye message options:');
    msg.channel.send({ embed });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: []
  };

  exports.help = {
    name: 'msgoptions',
    description: 'Shows you a list of all available options for your welcome and bye msg',
    usage: 'msgoptions',
    example: 'msgoptions ',
	category: 'administration'
  };
