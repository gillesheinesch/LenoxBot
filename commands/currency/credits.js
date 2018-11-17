const Discord = require('discord.js');
const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const user1 = msg.mentions.users.first() || msg.author;
	const userdb = client.userdb.get(msg.author.id);
	const lenoxbotcoin = client.emojis.get('412952854354067456');

	if (userdb.creditsmessage === false) {
		const embed = new Discord.RichEmbed()
			.setColor('#3399ff')
			.setDescription(lang.credits_hintembed)
			.setAuthor(lang.credits_hint);

		userdb.creditsmessage = true;
		client.userdb.set(msg.author.id, userdb);

		msg.author.send({
			embed
		});
	}

	const rows = await sql.all(`SELECT * FROM medals GROUP BY userId ORDER BY medals DESC`);
	const useridsArray = [];
	const userArray = [];
	const moneyArray = [];
	const tempArray = [];
	const globalrank = [];
	rows.forEach(row => {
		useridsArray.push(row.userId);
		const member = client.users.get(row.userId);
		userArray.push(member ? member.tag : row.userId);
		moneyArray.push(row.medals);
	});
	for (let i = 0; i < userArray.length; i++) {
		tempArray.push((i + 1));
	}

	for (let index = 0; index < userArray.length; index++) {
		if (useridsArray[index] === user1.id) {
			globalrank.push(tempArray[index]);
		}
	}

	sql.get(`SELECT * FROM medals WHERE userId = "${user1.id}"`).then(row => {
		const embed = new Discord.RichEmbed()
			.setAuthor(`${user1.tag} (${lang.credits_globalrank} #${globalrank})`, user1.avatarURL)
			.setDescription(`**${lang.credits_credits}** ${row.medals} ${lenoxbotcoin} `)
			.setColor('GREEN');

		msg.channel.send({
			embed
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Credits',
	aliases: ['balance', 'c'],
	userpermissions: [],
	dashboardsettings: false
};
exports.help = {
	name: 'credits',
	description: 'Shows you the credits of you or another user',
	usage: 'credits [@User]',
	example: ['credits @Monkeyyy11#7584'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
