exports.run = async (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	await msg.channel.send(lang.restart_message);

	process.exit(42);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: "General",
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
