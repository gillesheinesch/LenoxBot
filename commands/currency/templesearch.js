const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = (client, msg, args, lang) => {
	const random = Math.random();
	const userdb = client.userdb.get(msg.author.id);

	if (userdb.inventory.flashlight === 0) {
		const timestamps = client.cooldowns.get('templesearch');
		delete timestamps[msg.author.id];
		client.cooldowns.set('templesearch', timestamps);
		return msg.reply(lang.templesearch_error);
	}

	if (random < 0.5) {
		const result = Math.floor(Math.random() * 500) + 1;

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + result} WHERE userId = ${msg.author.id}`);
		});

		userdb.inventory.flashlight -= 1;
		client.userdb.set(msg.author.id, userdb);

		const received = lang.templesearch_received.replace('%amount', `\`$${result}\``);
		return msg.reply(received);
	}
	userdb.inventory.pickaxe = userdb.inventory.flashlight - 1;
	client.userdb.set(msg.author.id, userdb);

	return msg.reply(lang.templesearch_dust);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true,
	cooldown: 600000
};
exports.help = {
	name: 'templesearch',
	description: `Search for something valuable in the long-abandoned temple in the Sahara`,
	usage: 'templesearch',
	example: ['templesearch'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
