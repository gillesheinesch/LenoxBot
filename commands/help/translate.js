const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const embed = new Discord.RichEmbed()
		.setTitle(lang.translate_embedtitle)
		.setDescription(lang.translate_embeddescription)
		.addField(lang.translate_embedfieldtitle, 'https://crowdin.com/project/lenoxbot')
		.setURL('https://crowdin.com/project/lenoxbot')
		.setColor('BLUE');

	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Help',
	aliases: [],
	userpermissions: [],
	dashboardsettings: false
};

exports.help = {
	name: 'translate',
	description: 'Gives you informations about our translation project',
	usage: 'translate',
	example: ['translate'],
	category: 'help',
	botpermissions: ['SEND_MESSAGES']
};
