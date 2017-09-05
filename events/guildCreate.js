const Discord = require('discord.js');
exports.run = (client, guild) => {
	const defaultSettings = {
		prefix: '?',
		modlog: 'false',
		modlogchannel: '',
		messagedellog: 'false',
		messagedellogchannel: '',
		messageupdatelog: 'false',
		messageupdatelogchannel: '',
		channelupdatelog: 'false',
		channelupdatelogchannel: '',
		channelcreatelog: 'false',
		channelcreatelogchannel: '',
		channeldeletelog: 'false',
		channeldeletelogchannel: '',
		guildmemberupdatelog: 'false',
		guildmemberupdatelogchannel: '',
		presenceupdatelog: 'false',
		presenceupdatelogchannel: '',
		welcomelog: 'false',
		welcomelogchannel: '',
		byelog: 'false',
		byelogchannel: '',
		rolecreatelog: 'false',
		rolecreatelogchannel: '',
		roledeletelog: 'false',
		roledeletelogchannel: '',
		roleupdatelog: 'false',
		roleupdatelogchannel: '',
		welcome: 'false',
		welcomemsg: '',
		bye: 'false',
		byemsg: '',
		welcomebyechannel: '',
		commanddel: 'false',
		announce: 'false',
		announcechannel: '',
		selfassignableroles: []
	};
	client.guildconfs.set(guild.id, defaultSettings);
	guild.owner.send(`Hello ${guild.owner.user.username}, \nThanks for choosing LenoxBot! Currently, we are still in the alpha phase, so it can lead to problems. If you find any problems, you can report them on our Discord server: https://discord.gg/5mpwCr8 \n\nYou can use the command ?modules to see all modules of the bot \nTo see all commands of a module, just use ?commands modulename \nTo see more details about a command, just use ?help commandname \n\nWe would be pleased to welcome you to our Discord-Server: https://discord.gg/5mpwCr8`);
	const embed = new Discord.RichEmbed()
	.setTimestamp()
	.setAuthor(`${guild.name} (${guild.id})`)
	.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
	.setColor('#0066CC')
	.setFooter('Joined guild');
	client.channels.get('353989483517181962').send({ embed: embed });
};
