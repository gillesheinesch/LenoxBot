exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send(lang.stop_notvoicechannel);
	if (!serverQueue) return msg.channel.send(lang.stop_notvoicechannel);
	serverQueue.songs = [];
	serverQueue.connection.dispatcher.destroy();
	return msg.channel.send(lang.stop_leftchannel);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Musicplayersettings',
	aliases: [],
	userpermissions: ['MANAGE_GUILD'],
	dashboardsettings: true
};

exports.help = {
	name: 'stop',
	description: 'Stops the current music and the bot leaves the voice channel',
	usage: 'stop',
	example: ['stop'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
