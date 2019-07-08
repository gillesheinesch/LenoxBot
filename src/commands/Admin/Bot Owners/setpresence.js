const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text', 'dm'],
			aliases: ['setgame'],
			guarded: true,
			permissionLevel: 10,
			description: language => language.get('COMMAND_SETPRESENCE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_SETPRESENCE_EXTENDEDHELP'),
			usage: '<status:...string>',
			usageDelim: ' ',
		});
	}

	async run(message, [status]) {
		await this.client.user.setActivity(status, { type: 'PLAYING' });

		return message.sendLocale('COMMAND_SETPRESENCE_DONE');
	}

};
