exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const input = args.slice();

	if (!input || input.length === 0) return msg.reply(lang.channelblacklistremove_error);

	let channel;
	try {
		channel = msg.guild.channels.find(r => r.name.toLowerCase() === input.join(' ').toLowerCase());
	} catch (error) {
		return msg.channel.send(lang.channelblacklistadd_channelnotfind);
	}

	if (channel.type !== 'voice') return msg.reply(lang.channelblacklistremove_wrongtype);

	for (let i = 0; i < tableload.musicchannelblacklist.length; i++) {
		if (channel.id === tableload.musicchannelblacklist[i]) {
			tableload.musicchannelblacklist.splice(i, 1);
			client.guildconfs.set(msg.guild.id, tableload);
			return msg.reply(lang.channelblacklistremove_removed);
		}
	}

	return msg.reply(lang.channelblacklistremove_channelnotblacklisted);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Channelblacklist',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};

exports.help = {
	name: 'channelblacklistremove',
	description: 'Removes a voicechannel from the blacklist',
	usage: 'channelblacklistremove {name of the voicechannel}',
	example: ['channelblacklistremove music #1'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
