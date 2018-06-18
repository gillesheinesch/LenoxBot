const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const embed = new Discord.RichEmbed()
	.setColor('0066CC')
	.addField(lang.website_documentation, `https://lenoxbot.com/`);

    return msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'website',
	description: 'Shows you the Trello website of the bot',
	usage: 'website',
	example: ['website'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};
