const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const embed = new Discord.RichEmbed()
	.setColor('0066CC')
	.addField('Here you can find our documentation:', `https://www.monkeyyy11.de/`)
    .addField('Here you can find our Trello-Website:', `https://trello.com/b/2IoFBIQ8/lenoxbot`);
    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};

exports.help = {
	name: 'website',
	description: 'Shows you the Trello website of the bot ',
	usage: 'website',
	example: ['website'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};
