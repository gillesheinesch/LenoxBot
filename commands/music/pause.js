exports.run = (client, msg, args) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (serverQueue && serverQueue.playing) {
		serverQueue.playing = false;
		serverQueue.connection.dispatcher.pause();
		return msg.channel.send('Paused the music for you!');
	}
	return msg.channel.send('There is nothing playing.');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'pause',
	description: 'Stops the current music',
	usage: 'pause',
	example: ['pause'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES', 'SPEAK']
};
