const { Command } = require('klasa');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_SKIPNUMBER_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_SKIPNUMBER_EXTENDEDHELP'),
			usage: '<Number:int>',
			requiredPermissions: ['SEND_MESSAGES'],
			guarded: true,
			permissionLevel: 10
		});
	}

	async run(message, [number]) {
		const settings = this.client.settings;
		if (!number) return message.channel.sendLocale('COMMAND_SKIPNUMBER_CURRENTVOTENUMBER', [settings.get('skipnumber')]);
		if (isNaN(number)) return message.channel.sendLocale('COMMAND_SKIPNUMBER_NOINPUT');
		if (number < 1) return message.channel.sendLocale('COMMAND_SKIPNUMBER_CANNOTBE0');

		await settings.update('skipnumber', number);
		return message.channel.sendLocale('COMMAND_SKIPNUMBER_CHANGEDSKIPVOTE', [number]);
	}
};
