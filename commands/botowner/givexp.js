const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);
	const userId = msg.mentions.users.first() ? msg.mentions.users.first().id : msg.mentions.users.first() || args.slice(0, 1).join(' ');
	const xpAmount = parseInt(args.slice(1, 2).join(' '), 10);

	if (args.slice(1, 2).length === 0) return msg.reply(lang.givexp_noamount);
	if (isNaN(xpAmount)) return msg.reply(lang.givexp_amountnan);
	if (xpAmount <= 0) return msg.reply(lang.givexp_atleast1);

	await sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${userId}"`).then(row => {
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
		sql.run('CREATE TABLE IF NOT EXISTS scores (guildid TEXT, userId TEXT, points INTEGER, level INTEGER)').then(() => {
			sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, userId, xpAmount, 0]);
		});
	});

	return msg.reply(lang.givexp_done);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'xp',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'givexp',
	description: 'Gives an user a specific amount of XP on this discord server',
	usage: 'givexp {userid} {amount}',
	example: ['givexp 327533963923161090 1000'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
