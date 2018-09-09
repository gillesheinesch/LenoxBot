exports.run = async (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send(lang.forceskip_notvoicechannel);
	if (!serverQueue) return msg.channel.send(lang.forceskip_noserverqueue);
	await serverQueue.connection.dispatcher.destroy();
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Skip',
	aliases: [],
	userpermissions: ['MANAGE_GUILD'],
	dashboardsettings: true
};
exports.help = {
	name: 'forceskip',
	description: 'Forces the bot to skip the current song without a poll!',
	usage: 'forceskip',
	example: ['forceskip'],
	category: 'music',
	botpermissions: ['ADMINISTRATOR', 'SEND_MESSAGES', 'SPEAK']
};
