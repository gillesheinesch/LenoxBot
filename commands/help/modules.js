const Discord = require('discord.js');

exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	var commandscommand = lang.modules_commandscommand.replace('%prefix', tableload.prefix);
	const embed = new Discord.RichEmbed()
    .setFooter(commandscommand)
    .setColor('0066CC')
	.setDescription(`**${lang.modules_embed}**\n► Administration \n► Moderation \n► Help \n► Music \n► Fun \n► Searches \n► NSFW \n► Utility \n► Application \n► Currency`);

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['m'],
    userpermissions: []
};

exports.help = {
	name: 'modules',
	description: 'Gives you a list of all modules',
	usage: 'modules',
	example: ['modules'],
	category: 'help',
    botpermissions: ['SEND_MESSAGES']
};
