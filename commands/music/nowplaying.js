exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!serverQueue) return msg.channel.send(lang.nowplaying_nothing);

	const nowplaying = lang.nowplaying_nowplaying.replace('%songtitle', `**${serverQueue.songs[0].title}**`);
	return msg.channel.send(nowplaying);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: ['np'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'nowplaying',
	description: 'Shows you the current music title',
	usage: 'nowplaying',
	example: ['nowplaying'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
