const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const embed = new Discord.RichEmbed()
		.setColor('#7FFFD4')
		.setDescription(`$username$ = ${lang.msgoptions_username} \n$userid$ = ${lang.msgoptions_userid} \n$guildname$ = ${lang.msgoptions_guildname} \n$guildid$ = ${lang.msgoptions_guildid}`)
		.setAuthor(lang.msgoptions_embed);
	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'msgoptions',
	description: 'Shows you a list of all available options for your welcome and bye msg',
	usage: 'msgoptions',
	example: ['msgoptions'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
