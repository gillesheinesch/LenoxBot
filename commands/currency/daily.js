const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const mentioncheck = msg.mentions.users.first();
	const userdb = await client.userdb.get(msg.author.id);
	const botconfs = await client.botconfs.get('botconfs');

	if (userdb.dailyremind === true) {
		botconfs.dailyreminder[msg.author.id] = {
			userID: msg.author.id,
			remind: Date.now() + 86400000
		};
		await client.botconfs.set('botconfs', botconfs);

		setTimeout(() => {
			delete botconfs.dailyreminder[msg.author.id];
			client.botconfs.set('botconfs', botconfs);
			msg.author.send('Don\'t forget to pick up your daily reward');
		}, 86400000);
	}

	if (userdb.dailystreak.lastpick !== '') {
		if (Date.now() > userdb.dailystreak.deadline) {
			userdb.dailystreak.streak = 0;
			userdb.dailystreak.lastpick = '';
			userdb.dailystreak.deadline = '';
			await client.userdb.set(msg.author.id, userdb);
		}
	}

	userdb.dailystreak.streak += 1;
	userdb.dailystreak.lastpick = Date.now();
	userdb.dailystreak.deadline = Date.now() + 172800000;
	await client.userdb.set(msg.author.id, userdb);

	if (!mentioncheck) {
		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + (userdb.premium.status === false ? 200 + (userdb.dailystreak.streak * 2) : 400 + (userdb.dailystreak.streak * 2))} WHERE userId = ${msg.author.id}`);
		});

		const author = lang.daily_author.replace('%amount', userdb.premium.status === false ? 200 + (userdb.dailystreak.streak * 2) : 400 + (userdb.dailystreak.streak * 2)).replace('%streak', userdb.dailystreak.streak);
		if (userdb.dailyremind === true) {
			return msg.channel.send(`🎁 ${author} \n${lang.daily_remindmsg}`);
		}
		return msg.channel.send(`🎁 ${author}`);
	}

	sql.get(`SELECT * FROM medals WHERE userId ="${mentioncheck.id}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [mentioncheck.id, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals + (userdb.premium.status === false ? 200 + (userdb.dailystreak.streak * 2) : 400 + (userdb.dailystreak.streak * 2))} WHERE userId = ${mentioncheck.id}`);
	});

	const mention = lang.daily_mention.replace('%mentiontag', mentioncheck.tag).replace('%amount', userdb.premium.status === false ? 200 + (userdb.dailystreak.streak * 2) : 400 + (userdb.dailystreak.streak * 2)).replace('%streak', userdb.dailystreak.streak);
	if (userdb.dailyremind === true) {
		return msg.channel.send(`🎁 ${mention} \n${lang.daily_remindmsg}`);
	}
	return msg.channel.send(`🎁 ${mention}`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Daily',
	aliases: ['d'],
	userpermissions: [],
	dashboardsettings: false,
	cooldown: 86400000
};
exports.help = {
	name: 'daily',
	description: 'Get your daily reward or give it away to another discord user',
	usage: 'daily [@User]',
	example: ['daily', 'daily @Tester#3873'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
