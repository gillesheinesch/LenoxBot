exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);

	if (!serverQueue || serverQueue.songs.length === 1) return msg.channel.send(lang.queueclear_queueempty);

	const newArray = serverQueue.songs.slice(1, serverQueue.songs.length);
	serverQueue.songs = newArray;
	return msg.reply(lang.queueclear_done);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Queue',
	aliases: [],
	userpermissions: ['MANAGE_GUILD'],
	dashboardsettings: true
};

exports.help = {
	name: 'queueclear',
	description: 'Clears the whole music queue',
	usage: 'queueclear',
	example: ['queueclear'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
