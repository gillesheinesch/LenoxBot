const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const embed = new Discord.RichEmbed()
    .setFooter(`You can use ${tableload.prefix}commands {modulename} to get a list of all commands in a module.`)
    .setColor('0066CC')
	.setDescription('**A list of all modules**\n► Administration \n► Moderation \n► Help \n► Music \n► Fun \n► Searches \n► NSFW \n► Utility \n► Application');

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
