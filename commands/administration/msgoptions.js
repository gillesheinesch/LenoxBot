const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const validation = ['$usertag$', '$usermention$', '$username$', '$userid$', '$guildname$', '$guildid$'];

	const embed = new Discord.RichEmbed()
		.setColor('#7FFFD4')
		.setAuthor(lang.msgoptions_embed);

		for (var i = 0; i < validation.length; i++) {
			embed.addField(validation[i], lang[`msgoptions_${validation[i]}`]);
		}

	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
<<<<<<< HEAD
	userpermissions: []
=======
	userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'msgoptions',
	description: 'Shows you a list of all available options for your welcome and bye msg',
	usage: 'msgoptions',
	example: ['msgoptions'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
