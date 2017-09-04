const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    const embed = new Discord.RichEmbed()
    .setColor('0066CC')
    .setDescription('**A list of all events**\n► messagedelete \n► messageupdate \n► guildupdate \n► channelupdate \n► channelcreate \n► channeldelete \n► welcomemmessage \n► byemessage')
    .setAuthor('List of all events');
    msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'listevents',
	description: 'Lists you all events that you can log on your server',
	usage: 'listevents',
	example: 'listevents',
	category: 'administration'
};
