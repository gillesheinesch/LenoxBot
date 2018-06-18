exports.run = (client, msg, args, lang) => {
    const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!serverQueue) return msg.channel.send(lang.nowplaying_nothing);

	var nowplaying = lang.nowplaying_nowplaying.replace('%songtitle', `**${serverQueue.songs[0].title}**`);
	return msg.channel.send(nowplaying);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['np'],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'nowplaying',
	description: 'Shows you the current music title',
	usage: 'nowplaying',
	example: ['nowplaying'],
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
