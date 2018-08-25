const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const embed = new Discord.RichEmbed()
	.setColor('0066CC')
	.addField(lang.website_website, `https://lenoxbot.com/`)
	.addField(lang.website_documentation, `https://docs.lenoxbot.com`)
	.addField(lang.website_trello, `https://trello.com/b/2IoFBIQ8/lenoxbot`);

    return msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'website',
	description: 'Shows you the Trello website of the bot',
	usage: 'website',
	example: ['website'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};
