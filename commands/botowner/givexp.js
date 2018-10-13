const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	const userId = msg.mentions.users.first() ? msg.mentions.users.first().id : msg.mentions.users.first() || args.slice(0, 1).join(' ');
	const xpAmount = parseInt(args.slice(1, 2).join(' '), 10);

	if (args.slice(1, 2).length === 0) return msg.reply('Amount missing!');
	if (isNaN(xpAmount)) return msg.reply('Not a number!');
	if (xpAmount <= 0) return msg.reply('At least 1 xp');

	await sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${userId}"`).then(row => {
		console.log(row, row.points + xpAmount);
		if (row) {
			const curLevel = Math.floor(0.3 * Math.sqrt(row.points + xpAmount));
			if (curLevel > row.level) {
				row.level = curLevel;
				sql.run(`UPDATE scores SET points = ${row.points + xpAmount}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${userId}`);
			}
			if (curLevel < row.level) {
				row.level = curLevel;
				sql.run(`UPDATE scores SET points = ${row.points + xpAmount}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${userId}`);
			}
			sql.run(`UPDATE scores SET points = ${row.points + xpAmount} WHERE guildId = ${msg.guild.id} AND userId = ${userId}`);
		} else {
			sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, userId, xpAmount, 0]);
		}
	}).catch(() => {
		console.log(1);
		sql.run('CREATE TABLE IF NOT EXISTS scores (guildid TEXT, userId TEXT, points INTEGER, level INTEGER)').then(() => {
			sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, userId, xpAmount, 0]);
		});
	});

	return msg.reply('done!');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Credits',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'givexp',
	description: '',
	usage: 'givexp {userid} {amount}',
	example: ['givexp 327533963923161090 1000'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
