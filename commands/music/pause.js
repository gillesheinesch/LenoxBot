exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (serverQueue && serverQueue.playing) {
		serverQueue.playing = false;
		serverQueue.connection.dispatcher.pause();
		return msg.channel.send(lang.pause_paused);
	}
	return msg.channel.send(lang.pause_nothing);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
<<<<<<< HEAD
	userpermissions: []
=======
	userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'pause',
	description: 'Stops the current music',
	usage: 'pause',
	example: ['pause'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES', 'SPEAK']
};
