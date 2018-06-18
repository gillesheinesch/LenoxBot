exports.run = (client, msg, args, lang) => {
    const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue) return msg.channel.send(lang.queueclear_queueempty);
    return serverQueue.songs = [];
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
	name: 'queueclear',
	description: 'Clears the whole music queue',
	usage: 'queueclear',
	example: ['queueclear'],
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
