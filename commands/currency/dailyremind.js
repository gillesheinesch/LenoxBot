exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const userdb = client.userdb.get(msg.author.id);

	if (userdb.dailyremind === false) {
		userdb.dailyremind = true;

		const set = lang.dailyremind_set.replace('%prefix', tableload.prefix);
		msg.reply(set);
	} else {
		userdb.dailyremind = false;

		const removed = lang.dailyremind_removed.replace('%prefix', tableload.prefix)
		msg.reply(removed);
	}

	await client.userdb.set(msg.author.id, userdb);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: [],
    dashboardsettings: false
};
exports.help = {
	name: 'dailyremind',
	description: '',
	usage: '',
	example: [],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
