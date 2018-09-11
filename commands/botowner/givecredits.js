const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const user = msg.mentions.users.first();
	const amountofcoins = parseInt(args.slice(1).join(' '), 10);

	if (!user) return msg.reply(lang.givecredits_nomention);
	if (!amountofcoins) return msg.reply(lang.givecredits_novalue);

	sql.get(`SELECT * FROM medals WHERE userId ="${user.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [user.id, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals + amountofcoins} WHERE userId = ${user.id}`);
	}).catch(error => {
		console.error(error);
		sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [user.id, 0]);
		});
	});

	return msg.reply(lang.givecredits_done);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'givecredits',
	description: 'Gives a user a certain amount of credits',
	usage: 'givecredits {@USER} {count}',
	example: ['givecredits @Monkeyyy11#0001 2000'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
