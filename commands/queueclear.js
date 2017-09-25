exports.run = (client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR') || !msg.member.hasPermission('KICK_MEMBERS')) return msg.reply('You dont have permissions to execute this command!');	
    const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
    if (!serverQueue) return msg.channel.send('The queue of the bot is empty!');
    return serverQueue.songs = [];
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};

exports.help = {
	name: 'queueclear',
	description: 'Clears the whole music queue',
	usage: 'queueclear',
	example: 'queueclear',
	category: 'music'
};
