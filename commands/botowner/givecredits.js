const sql = require("sqlite");
sql.open("../lenoxbotscore.sqlite");
exports.run = (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	const user = msg.mentions.users.first();
	const amountofcoins = parseInt(args.slice(1).join(' '));
	if (!user) return msg.reply('You have to mention a user to give him medals');
	if (!amountofcoins) return msg.reply('You have to enter a value');
	sql.get(`SELECT * FROM medals WHERE userId ="${user.id}"`).then(row => {
        if (!row) {
            sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [user.id, 0]);
        }
        sql.run(`UPDATE medals SET medals = ${row.medals + amountofcoins} WHERE userId = ${user.id}`);
    }).catch((error) => {
        console.error(error);
        sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
            sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [user.id, 0]);
        });
    });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
    aliases: ['gm'],
    userpermissions: []
};
exports.help = {
	name: 'givecredits',
	description: 'Gives a user a certain amount of credits',
	usage: 'givecredits {@USER} {count}',
	example: 'givecredits @Monkeyyy11 2000',
    category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
