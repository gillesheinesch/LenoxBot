exports.run = (client, msg, args) => {
	if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel, please join a voice channel to play music!');
	if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
	serverQueue.connection.dispatcher.end();
	return undefined;
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'forceskip',
	description: 'Forces the bot to skip the current song without a poll!',
	usage: 'forceskip',
	example: 'forceskip',
	category: 'music'
};
