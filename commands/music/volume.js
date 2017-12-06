exports.run = (client, msg, args) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	const volumeinput = msg.content.split(' ');
	if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel, please join a voice channel to play music!');
	if (!serverQueue) return msg.channel.send('There is nothing playing.');
	if (!volumeinput[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
	if (volumeinput > 5) return msg.channel.send('You can only specify a volume between 1-5');
	serverQueue.volume = volumeinput[1];
	serverQueue.connection.dispatcher.setVolumeLogarithmic(volumeinput[1] / 5);
	return msg.channel.send(`I set the volume to: **${volumeinput[1]}**`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: ['MANAGE_GUILD']
};

exports.help = {
	name: 'volume',
	description: 'Changes the volume of the bot',
	usage: 'volume {1-5}',
	example: ['volume 3'],
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
