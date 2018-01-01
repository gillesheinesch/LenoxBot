exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	const volumeinput = msg.content.split(' ');

	if (!msg.member.voiceChannel) return msg.channel.send(lang.volume_notvoicechannel);
	if (!serverQueue) return msg.channel.send(lang.volume_nothing);
	var currentvolume = lang.volume_currentvolume.replace('%volume', serverQueue.volume);
	if (!volumeinput[1]) return msg.channel.send(currentvolume);
	if (volumeinput > 5) return msg.channel.send(lang.volume_error);

	serverQueue.volume = volumeinput[1];
	serverQueue.connection.dispatcher.setVolumeLogarithmic(volumeinput[1] / 5);

	var volumeset = lang.volume_volumeset.replace('%volumeinput', volumeinput[1]);
	return msg.channel.send(volumeset);
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
