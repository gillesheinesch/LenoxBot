exports.run = async (client, msg, args, lang) => {
	const input = args.slice();

	if (input.length === 0) return msg.channel.send(lang.setchanneltopic_error);

	await msg.channel.setTopic(input.join(' '));

	const set = lang.setchanneltopic_set.replace('%channelname', msg.channel.name);
	msg.channel.send(set);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: ['MANAGE_CHANNELS'],
	dashboardsettings: true
};
exports.help = {
	name: 'setchanneltopic',
	description: 'Sets a new channel topic for the current channel',
	usage: 'setchanneltopic {New channeltopic}',
	example: ['setchanneltopic Hello World'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_CHANNELS']
};
