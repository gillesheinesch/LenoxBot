const settings = require('../../settings.json');
exports.run = async (client, msg, args, lang) => {
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

	await msg.channel.send(lang.restart_message);

	process.exit(42);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: ['reboot'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'restart',
	description: 'Restarts the bot',
	usage: 'restart',
	example: ['restart'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
