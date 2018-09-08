exports.run = async(client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const tableload = client.botconfs.get('botconfs');
	const channelId = msg.channel.id;

	if (tableload.activity === false) {
		tableload.activity = true;
		tableload.activitychannel = channelId;

		const set = lang.activity_set.replace('%channelname', `#${msg.channel.name}`)
		return msg.channel.send(set);
	} else {
		tableload.activity = false;

		const unset = lang.activity_unset.replace('%channelname', `#${msg.channel.name}`)
		msg.channel.send(unset);
	}
	await client.botconfs.set('botconfs', tableload);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "General",
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'toggleactivity',
	description: 'Shows the current bot usage',
	usage: 'activity',
	example: ['activity'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
