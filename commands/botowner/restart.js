const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class restartCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'restart',
			group: 'botowner',
			memberName: 'restart',
			description: 'Restarts the bot',
			format: 'restart',
			aliases: ['reboot'],
			examples: ['restart'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

		await msg.channel.send(lang.restart_message);

		process.exit(42);
	}
};
