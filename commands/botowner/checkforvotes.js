const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	var array = [];
	await client.users.forEach(r => array.push(r.id));
	const upvoteconfs = { allusers: array };

	await client.botconfs.set('upvote', upvoteconfs);

	const botconfs = client.botconfs.get('upvote');

	var test = setInterval(async function () {
		console.log(botconfs.allusers.length);
		if (botconfs.allusers.length === 0) return clearInterval(test);
		if (await client.dbl.hasVoted(botconfs.allusers[0]) === true) {
			console.log(botconfs.allusers[0], true);
			await sql.get(`SELECT * FROM medals WHERE userId ="${botconfs.allusers[0]}"`).then(row => {
				if (!row) {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [botconfs.allusers[0], 0]);
				}
				sql.run(`UPDATE medals SET medals = ${row.medals + 1000} WHERE userId = ${botconfs.allusers[0]}`);
			}).catch((error) => {
				console.error(error);
				sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [botconfs.allusers[0], 0]);
				});
			});
			botconfs.allusers.splice(0, 1);
			await client.botconfs.set('upvote', botconfs);
		} else {
			botconfs.allusers.splice(0, 1);
			await client.botconfs.set('upvote', botconfs);
		}
	}, 1500);

	msg.reply('Checked!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'checkforvotes',
	description: 'translator',
	usage: 'donatoradd',
	example: ['donatoradd'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};