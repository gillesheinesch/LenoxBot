const Discord = require('discord.js');
exports.run = async (client, guild) => {
	const settings = require('../settings.json');
	const defaultSettings = {
		prefix: settings.prefix,
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
		guildupdatelog: '',
		guildupdatelogchannel: '',
		byelog: 'false',
		byelogchannel: '',
		rolecreatelog: 'false',
		rolecreatelogchannel: '',
		roledeletelog: 'false',
		roledeletelogchannel: '',
		roleupdatelog: 'false',
		roleupdatelogchannel: '',
		welcome: 'false',
		welcomechannel: '',
		welcomemsg: '',
		bye: 'false',
		byechannel: '',
		byemsg: '',
		commanddel: 'false',
		announce: 'false',
		announcechannel: '',
		selfassignableroles: [],
		minigames: 'false',
		modules: {
			fun: 'true',
			help: 'true',
			moderation: 'true',
			music: 'true',
			nsfw: 'true',
			searches: 'true',
			utility: 'true',
			application: 'true'
		},
		application: {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: '',
			status: 'false'
		},
		nicknamelog: [],
		warnlog: [],
		language: 'en'
	};
	await client.guildconfs.set(guild.id, defaultSettings);

	const tableload = client.guildconfs.get(guild.id);

	if (tableload.language === '') {
		tableload.language = 'en';
		await client.guildconfs.set(guild.id, tableload);
	}

	const embed1 = new Discord.RichEmbed()
		.setColor('#ccff33')
		.setDescription(`**Hello ${guild.owner.user.username},** \n\nYou can use the command **?modules** to see all modules of the bot \nTo see all commands of a module, just use **?commands {modulename}** \nTo see more details about a command, just use **?help {commandname}** \n\nIf you need any help you can join our discord server (https://lenoxbot.com/discord/) or visit our website (https://lenoxbot.com)`)
		.setAuthor('Thanks for choosing LenoxBot!', client.user.displayAvatarURL);

	guild.owner.send({
		embed: embed1
	});

	const embed = new Discord.RichEmbed()
		.setTimestamp()
		.setAuthor(`${guild.name} (${guild.id})`)
		.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
		.addField(`Channels`, `${guild.channels.size}`)
		.addField(`Members`, `${guild.memberCount}`)
		.setColor('#00ff00')
		.setFooter('JOINED DISCORD SERVER');
	client.channels.get('353989483517181962').send({
		embed: embed
	});
};
