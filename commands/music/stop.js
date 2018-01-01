exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send(lang.stop_notvoicechannel);
	if (!serverQueue) return msg.channel.send(lang.stop_notvoicechannel);
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.end();
	msg.channel.send(lang.stop_leftchannel);
	return undefined;
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['MANAGE_GUILD']
};

exports.help = {
	name: 'stop',
	description: 'Stops the current music and the bot leaves the voice channel',
	usage: 'stop',
	example: ['stop'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
