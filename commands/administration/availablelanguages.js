const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const embed = new Discord.RichEmbed()
		.setColor('')
		.setDescription(lang.availablelanguages_descriptionembed)
		.setAuthor(lang.availablelanguages_languages);

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Localization',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'availablelanguages',
	description: 'Shows you a list in which language the bot is available and can be changed',
	usage: 'availablelanguages',
	example: ['availablelanguages'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
