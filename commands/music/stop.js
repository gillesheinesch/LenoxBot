exports.run = (client, msg, args) => {
    const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
    if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel, please join a voice channel to play music!');
    if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
	msg.channel.send('I have left the voice channel!');
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
	example: 'stop',
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
