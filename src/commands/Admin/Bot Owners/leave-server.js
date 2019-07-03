const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_LEAVESERVER_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_LEAVESERVER_EXTENDEDHELP'),
			usage: '<Guild:guild>',
			aliases: ['leave-guild'],
			requiredPermissions: ['SEND_MESSAGES'],
			permissionLevel: 10
		});
	}

	async run(message, [guild]) {
		if (!guild) return message.channel.sendLocale('COMMAND_LEAVESERVER_NOTGUILDID');

		try {
			await guild.leave();
		} catch (error) {
			return message.reply(message.language.get('COMMAND_LEAVESERVER_NOFETCH'));
		}

		return message.channel.sendLocale('COMMAND_LEAVESERVER_DONE', [guild.id]);
	}
};