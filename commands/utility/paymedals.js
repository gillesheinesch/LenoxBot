const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args) => {
    const mention = msg.mentions.users.first();

	if (!mention) return msg.channel.send('You must mention a user to give some medals!');
	if (mention.id === msg.author.id) return msg.channel.send('You can not give yourself medals!');
    if (args.slice(1).length === 0) return msg.channel.send('You forgot to specify how many medals you want to give the user!');
    if (isNaN(args.slice(1))) return msg.channel.send('The amount of medals has to be a number!');
	if (parseInt(args.slice(1).join(" ")) === 0) return msg.channel.send('You can not give 0 medals');
	if (parseInt(args.slice(1).join(" ")) < 0) return msg.channel.send('You have to give away minimal one medal');

	const msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);

	if (msgauthortable.medals < parseInt(args.slice(1).join(" "))) return msg.channel.send('Unfortunately, you do not have enough medals!');

	sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
		if (!row) {
			sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals - parseInt(args.slice(1).join(" "))} WHERE userId = ${msg.author.id}`);
	  }).catch((error) => {
		console.error(error);
		sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
			sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
		});
	});

	sql.get(`SELECT * FROM medals WHERE userId ="${mention.id}"`).then(row => {
		if (!row) {
			sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
		}
			sql.run(`UPDATE medals SET medals = ${row.medals + parseInt(args.slice(1).join(" "))} WHERE userId = ${mention.id}`);
	  }).catch((error) => {
		console.error(error);
		sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
			sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [mention.id, 0]);
		});
	});
	return msg.channel.send(`${msg.author}, ${args.slice(1).join(" ")} medal(s) were given to ${mention.tag}!`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['pm'],
	userpermissions: []
};
exports.help = {
	name: 'paymedals',
	description: 'Allows a user to give their medals to someone ',
	usage: 'paymedals {@User} {Amount}',
	example: ['paymedals @Monkeyyy11#7584 100'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
