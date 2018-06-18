const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	const redeemload = client.redeem.get(msg.author.id);
	const input = args.slice();

	if (msg.guild.id !== '352896116812939264') return msg.channel.send(`${lang.redeem_notlenoxbotdiscordserver} https://lenoxbot.com/discord`);
	if (!input || input.length === 0) return msg.reply(lang.redeem_error);
	if (redeemload.redeemed !== '') return msg.reply(lang.redeem_already);
	if (redeemload.redeemkey === args.slice().join(" ")) return msg.reply(lang.redeem_errorownkey);

	const array = [];
	client.redeem.map(userid => array.push(userid.redeemkey));

	if (!array.includes(args.slice().join(" "))) return msg.reply(lang.redeem_notexist);

	redeemload.redeemed = args.slice().join(" ");
	await client.redeem.set(msg.author.id, redeemload);

	await client.redeem.map(r => {
		if (r.redeemkey === args.slice().join(" ")) {
			try {
				client.guilds.get('352896116812939264').members.get('78327894783297843');
			} catch (error) {
				return msg.reply(lang.redeem_ownernotondiscordserver);
			}
			sql.get(`SELECT * FROM medals WHERE userId ="${r.redeemkeyowner}"`).then(row => {
				if (!row) {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.redeemkeyowner, 0]);
				}
				sql.run(`UPDATE medals SET medals = ${row.medals + 50} WHERE userId = ${r.redeemkeyowner}`);
			}).catch((error) => {
				console.error(error);
				sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [r.redeemkeyowner, 0]);
				});
			});
			var redeemeddm = lang.redeem_redeemeddm.replace('%authortag', msg.author.tag);
			client.users.get(r.redeemkeyowner).send(redeemeddm);
			return msg.channel.send(lang.redeem_redeemed);
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: [], dashboardsettings: true
};

exports.help = {
	name: 'redeem',
	description: 'Redeem a redeem key from another Discord user',
	usage: 'redeem {key}',
	example: ['redeem 2014279259673834'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
