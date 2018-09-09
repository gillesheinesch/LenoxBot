const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const commandinfo = lang.events_commandinfo.replace('%prefix', tableload.prefix);

	const embed = new Discord.RichEmbed()
		.setColor('0066CC')
		.setFooter(commandinfo)
		.setAuthor(lang.events_events);

	if (tableload.modlog === 'true') {
		const channelID = tableload.modlogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Modlog ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Modlog ${lang.events_disabled}`, `/`);
	}

	if (tableload.messagedellog === 'true') {
		const channelID = tableload.messagedellogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Messagedelete ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Messagedelete ${lang.events_disabled}`, `/`);
	}

	if (tableload.messageupdatelog === 'true') {
		const channelID = tableload.messageupdatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Messageupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Messageupdate ${lang.events_disabled}`, `/`);
	}

	if (tableload.channelupdatelog === `true`) {
		const channelID = tableload.channelupdatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Channelupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Channelupdate ${lang.events_disabled}`, `/`);
	}

	if (tableload.channelcreatelog === `true`) {
		const channelID = tableload.channelcreatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Channelcreate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Channelcreate ${lang.events_disabled}`, `/`);
	}

	if (tableload.channeldeletelog === `true`) {
		const channelID = tableload.channeldeletelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Channeldelete ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Channeldelete ${lang.events_disabled}`, `/`);
	}

	if (tableload.guildmemberupdatelog === `true`) {
		const channelID = tableload.guildmemberupdatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Memberupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Memberupdate ${lang.events_disabled}`, `/`);
	}

	if (tableload.presenceupdatelog === `true`) {
		const channelID = tableload.presenceupdatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Presenceupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Presenceupdate ${lang.events_disabled}`, `/`);
	}

	if (tableload.welcomelog === `true`) {
		const channelID = tableload.welcomelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Userjoin ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Userjoin ${lang.events_disabled}`, `/`);
	}

	if (tableload.byelog === `true`) {
		const channelID = tableload.byelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Userleft ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Userleft ${lang.events_disabled}`, `/`);
	}

	if (tableload.rolecreatelog === `true`) {
		const channelID = tableload.rolecreatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Rolecreate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Rolecreate ${lang.events_disabled}`, `/`);
	}

	if (tableload.roledeletelog === `true`) {
		const channelID = tableload.roledeletelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Roledelete ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Roledelete ${lang.events_disabled}`, `/`);
	}

	if (tableload.roleupdatelog === `true`) {
		const channelID = tableload.roleupdatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Roleupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Roleupdate ${lang.events_disabled}`, `/`);
	}

	if (tableload.guildupdatelog === `true`) {
		const channelID = tableload.guildupdatelogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Guildupdate ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Guildupdate ${lang.events_disabled}`, `/`);
	}

	if (tableload.chatfilterlog === `true`) {
		const channelID = tableload.chatfilterlogchannel;
		const channelName = client.channels.get(channelID).name;
		embed.addField(`✅ Chatfilter ${lang.events_active}`, `#${channelName} (${channelID})`);
	} else {
		embed.addField(`❌ Chatfilter ${lang.events_disabled}`, `/`);
	}
	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Events',
	aliases: ['e'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'events',
	description: 'Gives you a list of all active/disabled events',
	usage: 'events',
	example: ['events'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
