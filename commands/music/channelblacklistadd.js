exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const input = args.slice();

	if (!input || input.length === 0) return msg.reply(lang.channelblacklistadd_error);

	let channel;
	try {
		channel = msg.guild.channels.find(r => r.name.toLowerCase() === input.join(' ').toLowerCase());
	} catch (error) {
		return msg.channel.send(lang.channelblacklistadd_channelnotfind);
	}

	if (channel.type !== 'voice') return msg.reply(lang.channelblacklistadd_wrongtype);

	for (let i = 0; i < tableload.musicchannelblacklist.length; i++) {
		if (tableload.musicchannelblacklist[i] === channel.id) return msg.reply(lang.channelblacklistadd_already);
	}

	const channelid = channel.id;

	tableload.musicchannelblacklist.push(channelid);
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.reply(lang.channelblacklistadd_added);
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
	name: 'channelblacklistadd',
	description: 'Adds a voicechannel to the blacklist',
	usage: 'channelblacklistadd {name of the voicechannel}',
	example: ['channelblacklistadd music #1'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
