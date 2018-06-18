exports.run = async (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	await msg.channel.send('The bot now restarts. See you soon! 👋');
	process.exit(42);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['reboot'],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'restart',
	description: 'Restart the bot',
	usage: 'restart',
	example: ['restart'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
