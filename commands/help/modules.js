const Discord = require('discord.js');

exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	var commandscommand = lang.modules_commandscommand.replace('%prefix', tableload.prefix);
	const embed = new Discord.RichEmbed()
    .setFooter(commandscommand)
	.setColor('0066CC')
	.addField('Administration', lang.modules_administration)
	.addField('Moderation', lang.modules_administration)
	.addField('Help', lang.modules_help)
	.addField('Music', lang.modules_music)
	.addField('Fun', lang.modules_fun)
	.addField('Searches', lang.modules_searches)
	.addField('NSFW', lang.modules_nsfw)
	.addField('Utility', lang.modules_utility)
	.addField('Application', lang.modules_application)
	.addField('Currency', lang.modules_currency)
	.addField('Tickets', lang.modules_tickets)
	.setTitle(lang.modules_embed);

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['m'],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: false
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'modules',
	description: 'Gives you a list of all modules and their meaning',
	usage: 'modules',
	example: ['modules'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};
