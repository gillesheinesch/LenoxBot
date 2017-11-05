exports.run = (client, msg, args) => {
    const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
if (serverQueue && !serverQueue.playing) {
    serverQueue.playing = true;
    serverQueue.connection.dispatcher.resume();
    return msg.channel.send('Resumed the music for you!');
}
return msg.channel.send('There is nothing playing.');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: []
};

exports.help = {
	name: 'resume',
	description: 'Continues the current music',
	usage: 'resume',
	example: 'resume',
	category: 'music',
    botpermissions: ['SEND_MESSAGES', 'SPEAK']
};
