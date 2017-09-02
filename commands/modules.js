const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const embed = new Discord.RichEmbed()
    .setFooter('You can use `?commands Modulename` to get a list of all commands in a module')
    .setColor('0066CC')
    .setDescription('**A list of all modules**\n► Administration \n► Music \n► Minigames \n► Searches \n► NSFW \n► Help \n► Utility');
	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['ow']
};

exports.help = {
	name: 'modules',
	description: 'Gives you a list of all modules',
	usage: 'modules',
	example: 'modules'
};
