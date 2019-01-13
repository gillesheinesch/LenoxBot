const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class queueCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'queue',
			group: 'music',
			memberName: 'queue',
			description: 'Plays a music playlist',
			format: 'queue',
			aliases: [],
			examples: ['queue'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'Queue',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const queue = msg.client.queue;
		const serverQueue = queue.get(msg.guild.id);
		if (!serverQueue || serverQueue.songs.length === 0) return msg.channel.send(lang.queue_nothing);

		const nowplaying = lang.queue_nowplaying.replace('%songtitle', serverQueue.songs[0].title);
		const songqueue = lang.queue_songqueue.replace('%songtitle', serverQueue.songs[0].title);
		const embed = new Discord.RichEmbed()
			.setColor('#009696')
			.setDescription(`${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
		\n${nowplaying}`)
			.setAuthor(songqueue, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');
		return msg.channel.send({ embed });
	}
};
