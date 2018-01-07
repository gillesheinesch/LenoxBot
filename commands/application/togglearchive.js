const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	const channelid = msg.channel.id;
	if (tableload.application.archivechannel === false) {
		tableload.application.archivechannel = true;
		tableload.application.archivechannellog = channelid;
		await client.guildconfs.set(msg.guild.id, tableload);
		
		var set = lang.togglearchive_set.replace('%channelname', `**#${msg.channel.name}**`);
		return msg.channel.send(set);
	} else {
		tableload.application.archivechannel = false;
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send(lang.togglearchive_deleted);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'togglearchive',
	description: 'Sets the current channel as archive channel where all processed applications are archived',
	usage: 'togglearchive',
	example: ['togglearchive'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
