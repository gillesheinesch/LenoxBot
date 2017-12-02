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
		minigames: 'false'
	};
	await client.guildconfs.set(guild.id, defaultSettings);
	
	guild.owner.send(`Hello ${guild.owner.user.username}, \nThanks for choosing LenoxBot! Currently, we are still in the beta phase, so it can lead to problems which we will fix as fast as we can. If you find any bugs, you can report them on our Discord server: https://discord.gg/5mpwCr8 \n\nYou can use the command **?modules** to see all modules of the bot \nTo see all commands of a module, just use **?commands {modulename}** \nTo see more details about a command, just use **?help {commandname}** \n\nIf you need any help you can join our discord server or take a look at our documentation https://discord.gg/5mpwCr8 | https://www.monkeyyy11.de/`);
	const embed = new Discord.RichEmbed()
	.setTimestamp()
	.setAuthor(`${guild.name} (${guild.id})`)
	.addField(`Owner`, `${guild.owner.user.tag} (${guild.ownerID})`)
	.setColor('#0066CC')
	.setFooter('Joined guild');
	client.channels.get('353989483517181962').send({ embed: embed });

	const snekfetch = require('snekfetch');
	snekfetch.post(`https://discordbots.org/api/bots/stats`)
	  .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NDcxMjMzMzg1MzEzMDc1MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTA5NjU3MTkzfQ.dDleV67s0ESxSVUxKxeQ8W_z6n9YwrDrF9ObU2MKgVE')
	  .send({ server_count: client.guilds.size })
	  .then(() => console.log('Updated discordbots.org stats.'))
	 .catch(err => console.error(`Whoops something went wrong: ${err.body}`));
};
