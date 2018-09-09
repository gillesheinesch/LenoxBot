const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const validation = ['$usertag$', '$usermention$', '$username$', '$userid$', '$guildname$', '$guildid$'];

	const embed = new Discord.RichEmbed()
		.setColor('#7FFFD4')
		.setAuthor(lang.msgoptions_embed);

	for (let i = 0; i < validation.length; i++) {
		embed.addField(validation[i], lang[`msgoptions_${validation[i]}`]);
	}

	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'msgoptions',
	description: 'Shows you a list of all available options for your welcome and bye msg',
	usage: 'msgoptions',
	example: ['msgoptions'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
