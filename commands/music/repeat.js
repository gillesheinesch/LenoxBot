exports.run = async (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);

  if (!msg.member.voiceChannel) return msg.channel.send(`You are not in a voice channel, please join a voice channel to repeat the song!`);
	if (!serverQueue) return msg.channel.send(`I can't repeat a song because the queue is empty!`);
  
	serverQueue.songs[0].repeat = !serverQueue.songs[0].repeat;
	serverQueue.loop = false;
	msg.channel.send(`Song looping has been ${serverQueue.songs[0].repeat ? '`enabled`' : '`disabled`'}.`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'repeat song',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'repeat',
	description: 'Allows the users to repeat the current playing song.',
	usage: 'repeat',
	example: ['repeat'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES', 'SPEAK']
};
