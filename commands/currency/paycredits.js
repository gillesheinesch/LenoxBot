const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const mention = msg.mentions.users.first();

	if (!mention) return msg.channel.send(lang.paycredits_nomention);
	if (mention.id === msg.author.id) return msg.channel.send(lang.paycredits_yourself);
	if (args.slice(1).length === 0) return msg.channel.send(lang.paycredits_noinput);
	if (isNaN(args.slice(1))) return msg.channel.send(lang.paycredits_number);
	if (parseInt(args.slice(1).join(' '), 10) === 0) return msg.channel.send(lang.paycredits_not0);
	if (parseInt(args.slice(1).join(' '), 10) < 2) return msg.channel.send(lang.paycredits_one);

	const msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);

	if (msgauthortable.medals < parseInt(args.slice(1).join(' '), 10)) return msg.channel.send(lang.paycredits_notenough);

	sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals - parseInt(args.slice(1).join(' '), 10)} WHERE userId = ${msg.author.id}`);
	  }).catch(error => {
		console.error(error);
		sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		});
	});

	sql.get(`SELECT * FROM medals WHERE userId ="${mention.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals + parseInt(args.slice(1).join(' '), 10)} WHERE userId = ${mention.id}`);
	  }).catch(error => {
		console.error(error);
		sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [mention.id, 0]);
		});
	});
	const medalsgiven = lang.paycredits_creditsgiven.replace('%author', msg.author).replace('%creditscount', args.slice(1).join(' ')).replace('%mentiontag', mention.tag);
	return msg.channel.send(medalsgiven);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Credits',
	aliases: ['pc'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'paycredits',
	description: 'Allows a user to give their credits to someone',
	usage: 'paycredits {@User} {amount}',
	example: ['paycredits @Monkeyyy11#7584 100'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
