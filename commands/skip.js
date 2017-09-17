exports.run = (client, msg, args) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel, please join a voice channel to play music!');
	if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
	serverQueue.connection.dispatcher.end();
	return msg.channel.send('I skipped this song successfully!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'skip',
	description: 'Skips the current music title',
	usage: 'skip',
	example: 'skip',
	category: 'music'
};
