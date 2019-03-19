const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class setgameCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'setgame',
			group: 'botowner',
			memberName: 'setgame',
			description: 'Sets a new game status for the bot',
			format: 'setgame {new game status}',
			aliases: [],
			examples: ['setgame LenoxBot'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

		const input = args.slice();
		if (!input || input.length === 0) return msg.reply(lang.setgame_error);

		await msg.client.user.setPresence({ game: { name: `${input.join(' ')}`, type: 0 } });

		return msg.channel.send(lang.setgame_done);
	}
};
