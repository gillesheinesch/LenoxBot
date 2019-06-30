const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PING_DESCRIPTION'),
			examples: ['ping'],
			aliases: ['pong', 'p0ng'],
			requiredPermissions: ['SEND_MESSAGES'],
			guarded: true
		});
	}

	async run(message) {
		const msg = await message.sendLocale('COMMAND_PING');
		return message.sendLocale('COMMAND_PINGPONG', [(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp) || 0, Math.round(this.client.ws.ping) || 0]);
	}
};
