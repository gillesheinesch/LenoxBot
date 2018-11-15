const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const creditsAmount = args.slice(0, 1);
	const tableload = client.guildconfs.get(msg.guild.id);

	if (isNaN(creditsAmount)) return msg.reply(lang.creditstoxp_nan);
	if (Number(creditsAmount) <= 0) return msg.reply(lang.creditstoxp_under1);

	const creditsTableOfTheUser = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
	if (creditsTableOfTheUser.medals < parseInt(creditsAmount, 10)) return msg.channel.send(lang.creditstoxp_nocredits);

	await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals - parseInt(creditsAmount, 10)} WHERE userId = ${msg.author.id}`);
	  }).catch(error => {
		console.error(error);
		sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
		});
	});

	await sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId ="${msg.author.id}"`).then(row => {
		if (row) {
			const curLevel = Math.floor(0.3 * Math.sqrt(row.points + Math.round(parseInt(creditsAmount, 10) / 2)));
			if (curLevel > row.level) {
				row.level = curLevel;
				sql.run(`UPDATE scores SET points = ${row.points + Math.round(parseInt(creditsAmount, 10) / 2)}, level = ${row.level} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);

				if (tableload.xpmessages === 'true') {
					const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', row.level);
					msg.channel.send(levelup);
				}
			}
			sql.get(`SELECT * FROM scores WHERE guildId ="${msg.guild.id}" AND userId = "${msg.author.id}"`).then(row2 => {
				for (let i = 1; i < tableload.ara.length; i += 2) {
					if (tableload.ara[i] < row2.points && !msg.member.roles.get(tableload.ara[i - 1])) {
						const role = msg.guild.roles.get(tableload.ara[i - 1]);
						msg.member.addRole(role);

						const automaticrolegotten = lang.messageevent_automaticrolegotten.replace('%rolename', role.name);
						msg.channel.send(automaticrolegotten);
					}
				}
			});
			sql.run(`UPDATE scores SET points = ${row.points + Math.round(parseInt(creditsAmount, 10) / 2)} WHERE guildId = ${msg.guild.id} AND userId = ${msg.author.id}`);
		} else {
			sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, msg.author.id, Math.round(parseInt(creditsAmount, 10) / 2), 0]);
		}
	}).catch(() => {
		sql.run('CREATE TABLE IF NOT EXISTS scores (guildid TEXT, userId TEXT, points INTEGER, level INTEGER)').then(() => {
			sql.run('INSERT INTO scores (guildId, userId, points, level) VALUES (?, ?, ?, ?)', [msg.guild.id, msg.author.id, Math.round(parseInt(creditsAmount, 10) / 2), 0]);
		});
	});

	const done = lang.creditstoxp_done.replace('%credits', `**${creditsAmount}**`).replace('%xp', `**${Math.round(parseInt(creditsAmount, 10) / 2)}**`);
	return msg.reply(done);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Credits',
	aliases: ['ctxp'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'creditstoxp',
	description: '',
	usage: 'creditstoxp {amount}',
	example: ['creditstoxp 1000'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
