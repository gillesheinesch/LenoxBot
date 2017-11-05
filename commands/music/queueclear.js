exports.run = (client, msg, args) => {
    const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue) return msg.channel.send('The queue of the bot is empty!');
    return serverQueue.songs = [];
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['MANAGE_GUILD']
};

exports.help = {
	name: 'queueclear',
	description: 'Clears the whole music queue',
	usage: 'queueclear',
	example: 'queueclear',
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
