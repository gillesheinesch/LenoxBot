exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (serverQueue && !serverQueue.playing) {
		serverQueue.playing = true;
		serverQueue.connection.dispatcher.resume();
		return msg.channel.send(lang.resume_resumed);
	}
	return msg.channel.send(lang.resume_nothing);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Musicplayersettings',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'resume',
	description: 'Continues the current music',
	usage: 'resume',
	example: ['resume'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES', 'SPEAK']
};
