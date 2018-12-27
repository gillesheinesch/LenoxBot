exports.run = async (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);

  if (!msg.member.voiceChannel) return msg.channel.send(`You are not in a voice channel, please join a voice channel to loop the queue!`);
	if (!serverQueue) return msg.channel.send(`I can't loop an empty queue!`);
  
	serverQueue.loop = !serverQueue.loop;
  msg.channel.send(`Queue looping has been ${serverQueue.loop ? '`enabled`' : '`disabled`'}.`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: '(un)Loop queue',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'loop',
	description: 'Allows the users to (un)loop the entire queue.',
	usage: 'loop',
	example: ['loop'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES', 'SPEAK']
};
