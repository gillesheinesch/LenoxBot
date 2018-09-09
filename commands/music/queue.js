const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const queue = client.queue;
	const serverQueue = queue.get(msg.guild.id);
	if (!serverQueue) return msg.channel.send(lang.queue_nothing);

	const nowplaying = lang.queue_nowplaying.replace('%songtitle', serverQueue.songs[0].title);
	const songqueue = lang.queue_songqueue.replace('%songtitle', serverQueue.songs[0].title);
	const embed = new Discord.RichEmbed()
		.setColor('#009696')
		.setDescription(`${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
		\n${nowplaying}`)
		.setAuthor(songqueue, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');
	return msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Queue',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'queue',
	description: 'Shows you the current music-queue',
	usage: 'queue',
	example: ['queue'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
