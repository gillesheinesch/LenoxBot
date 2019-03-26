const LenoxCommand = require('../LenoxCommand.js');

module.exports = class loopCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'loop',
			group: 'music',
			memberName: 'loop',
			description: 'Allows the users to (un)loop the entire queue.',
			format: 'loop',
			aliases: [],
			examples: ['loop'],
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
    serverQueue.loop = !serverQueue.loop;
	  serverQueue.songs[0].repeat = false;
		msg.channel.send(`Queue looping has been ${serverQueue.loop ? '`enabled`' : '`disabled`'}.`);
	}
};
