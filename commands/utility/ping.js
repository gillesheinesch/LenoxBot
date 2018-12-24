/**
 * TODO:
 * - Add throttling (cooldown)
 */

const LenoxCommand = require('../LenoxCommand.js');

module.exports = class pingCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'utility',
			memberName: 'ping',
			description: 'Shows you how long the bot needs to send a message',
			guarded: true,
			guildOnly: true,
			examples: ['ping'],
			ownerOnly: true,
			clientPermissions: ['SEND_MESSAGES']
		});
	}

	async run(msg) {
		const provider = msg.client.provider;

		const langSet = provider.get(msg.message.guild.id, 'language', 'en-US');
		const lang = require(`../../languages/${langSet}.json`);

		const message = await msg.channel.send('Ping?');
		const newmsg = lang.ping_ping.replace('%latency', message.createdTimestamp - msg.createdTimestamp).replace('%latencyapi', Math.round(msg.client.ping));
		message.edit(newmsg);
	}
};
