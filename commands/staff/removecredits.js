const sql = require('sqlite');
const settings = require('../../settings.json');
const Discord = require('discord.js');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

	const user = msg.mentions.users.first() ? msg.mentions.users.first().id : msg.mentions.users.first() || args.slice(0, 1).join(' ');
	const amountofcoins = parseInt(args.slice(1).join(' '), 10);

	if (!user) return msg.reply(lang.removecredits_nomention);
	if (!amountofcoins) return msg.reply(lang.removecredits_novalue);

	sql.get(`SELECT * FROM medals WHERE userId ="${user}"`).then(row => {
		if (!row) {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [user, 0]);
		}
		sql.run(`UPDATE medals SET medals = ${row.medals - amountofcoins} WHERE userId = ${user}`);
	}).catch(error => {
		console.error(error);
		sql.run('CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)').then(() => {
			sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [user, 0]);
		});
	});

	const embeddescription = lang.removecredits_embeddescription.replace('%credits', amountofcoins).replace('%user', user.tag);
	const embed = new Discord.RichEmbed()
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.setDescription(embeddescription)
		.setTimestamp()
		.setColor('RED');
	await client.channels.get('497395598182318100').send({
		embed
	});

	const done = lang.removecredits_done.replace('%credits', amountofcoins);
	return msg.reply(done);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Credits',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true,
	cooldown: 300000
};
exports.help = {
	name: 'removecredits',
	description: 'Removes an user a certain amount of credits',
	usage: 'removecredits {@USER} {amount}',
	example: 'removecredits @Monkeyyy11#0001 2000',
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
