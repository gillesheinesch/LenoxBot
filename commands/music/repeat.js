const LenoxCommand = require('../LenoxCommand.js');

module.exports = class repeatCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'repeat',
			group: 'music',
			memberName: 'repeat',
			description: 'Allows the users to repeat the current playing song',
			format: 'repeat',
			aliases: [],
			examples: ['repeat'],
			clientpermissions: ['SEND_MESSAGES', 'SPEAK'],
			userpermissions: [],
			shortDescription: 'Musicplayersettings',
			dashboardsettings: true
		});
	}

	run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const queue = msg.client.queue;
		const serverQueue = queue.get(msg.guild.id);
    if (!msg.member.voiceChannel) return msg.channel.send(`You are not in a voice channel, please join a voice channel to repeat the song!`);

    if (!serverQueue) return msg.channel.send(`I can't repeat a song because the queue is empty!`);
    serverQueue.songs[0].repeat = !serverQueue.songs[0].repeat;
    serverQueue.loop = false;
		msg.channel.send(`Song looping has been ${serverQueue.songs[0].repeat ? '`enabled`' : '`disabled`'}.`);
	}
};
