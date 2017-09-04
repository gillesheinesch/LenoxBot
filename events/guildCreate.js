const Discord = require('discord.js');
exports.run = (client, guild) => {
	const defaultSettings = {
		prefix: '?',
		modlog: 'false',
		modlogchannel: '',
		welcome: 'false',
		bye: 'false',
		welcomebyechannel: '',
		commanddel: 'false',
		announce: 'false',
		announcechannel: '',
		selfassignableroles: []
	};
	guild.owner.send(`Hello ${guild.owner.user.username}, \nThanks for choosing LenoxBot! Currently, we are still in the alpha phase, so it can lead to problems. If you find any problems, you can report them on our Discord server: https://discord.gg/5mpwCr8 \n\nYou can use the command ?modules to see all modules of the bot \nTo see all commands of a module, just use ?commands modulename \nTo see more details about a command, just use ?help commandname \n\nWe would be pleased to welcome you to our Discord-Server: https://discord.gg/5mpwCr8`);
	client.guildconfs.set(guild.id, defaultSettings);
	const embed = new Discord.RichEmbed()
	.setTimestamp()
	.setAuthor(`${guild.name} (${guild.id})`)
	.setColor('#0066CC')
	.setFooter('Joined guild');
	client.channels.get('353989483517181962').send({ embed: embed });
};
