const Discord = require('discord.js');
exports.run = async(client, guild) => {
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
	
	const tableconfig = client.guildconfs.get(guild.id);

	if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(guild.id, tableconfig);
	}

    var lang = require(`../languages/${tableconfig.language}.json`);

	guild.owner.send(`Hello ${guild.owner.user.username}, \nThanks for choosing LenoxBot! If you find any bugs, you can report them on our Discord server: https://discord.gg/c7DUz35 \n\nYou can use the command **?modules** to see all modules of the bot \nTo see all commands of a module, just use **?commands {modulename}** \nTo see more details about a command, just use **?help {commandname}** \n\nIf you need any help you can join our discord server or take a look at our documentation https://discord.gg/c7DUz35 | https://www.lenoxbot.com/`);
	
	const embed = new Discord.RichEmbed()
	.setTimestamp()
	.setAuthor(`${guild.name} (${guild.id})`)
	.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
	.setColor('#0066CC')
	.setFooter('Joined guild');
	client.channels.get('353989483517181962').send({ embed: embed });
};
