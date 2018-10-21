const settings = require('../../settings.json');
exports.run = async (client, msg, args, lang) => {
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

	const input = args.slice();
	if (!input || input.length === 0) return msg.reply(lang.setgame_error);

	await client.user.setPresence({ game: { name: `${input.join(' ')}`, type: 0 } });

	return msg.channel.send(lang.setgame_done);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'setgame',
	description: 'Sets a new game status for the bot',
	usage: 'setgame {new game status}',
	example: ['setgame LenoxBot'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
