exports.run = (client, msg, args) => {
    const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!serverQueue) return msg.channel.send('There is nothing playing.');
	return msg.channel.send(`Now playing: **${serverQueue.songs[0].title}**`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['np'],
    userpermissions: []
};
exports.help = {
	name: 'nowplaying',
	description: 'Shows you the current music title',
	usage: 'nowplaying',
	example: ['nowplaying'],
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
