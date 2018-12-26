const LenoxCommand = require('../LenoxCommand.js');

module.exports = class pingCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'utility',
			memberName: 'ping',
			description: 'Shows you how long the bot needs to send a message',
			format: 'ping',
			aliases: [],
			examples: ['ping'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'Information',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.get(msg.message.guild.id, 'language', 'en-US');
		const lang = require(`../../languages/${langSet}.json`);

		const message = await msg.channel.send('Ping?');
		const newmsg = lang.ping_ping.replace('%latency', message.createdTimestamp - msg.createdTimestamp).replace('%latencyapi', Math.round(msg.client.ping));
		message.edit(newmsg);
	}
};
