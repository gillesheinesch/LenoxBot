exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const userdb = client.userdb.get(msg.author.id);

	if (userdb.dailyremind === false) {
		userdb.dailyremind = true;

		const set = lang.dailyremind_set.replace('%prefix', tableload.prefix);
		msg.reply(set);
	} else {
		userdb.dailyremind = false;

		const removed = lang.dailyremind_removed.replace('%prefix', tableload.prefix);
		msg.reply(removed);
	}

	client.userdb.set(msg.author.id, userdb);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Daily',
	aliases: [],
	userpermissions: [],
	dashboardsettings: false
};
exports.help = {
	name: 'dailyremind',
	description: 'Enables or disables the dailyremind',
	usage: 'dailyremind',
	example: ['dailyremind'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
