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
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Information',
			dashboardsettings: true
		});
	}

	async run(msg) {
		console.log('Ping 1');
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		console.log('Ping 1.2');
		const lang = require(`../../languages/${langSet}.json`);
		console.log('Ping 1.3');

		const message = await msg.channel.send('Ping?');
		const newmsg = lang.ping_ping.replace('%latency', message.createdTimestamp - msg.createdTimestamp).replace('%latencyapi', Math.round(msg.client.ping));
		message.edit(newmsg);
		console.log('Ping 2');
	}
};
