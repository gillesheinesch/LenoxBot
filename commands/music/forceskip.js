exports.run = async(client, msg, args, lang) => {	
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send(lang.forceskip_notvoicechannel);
	if (!serverQueue) return msg.channel.send(lang.forceskip_noserverqueue);
	await serverQueue.connection.dispatcher.destroy();
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
    userpermissions: ['MANAGE_GUILD']
=======
    userpermissions: ['MANAGE_GUILD'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'forceskip',
	description: 'Forces the bot to skip the current song without a poll!',
	usage: 'forceskip',
	example: ['forceskip'],
	category: 'music',
    botpermissions: ['ADMINISTRATOR', 'SEND_MESSAGES', 'SPEAK']
};
