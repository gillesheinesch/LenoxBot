const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");

exports.run = async(client, msg, args, lang) => {
	const user1 = msg.mentions.users.first() || msg.author;
	const userdb = client.userdb.get(msg.author.id);
	const lenoxbotcoin = client.emojis.get('412952854354067456');

	if (userdb.creditsmessage === false) {
		const embed = new Discord.RichEmbed()
		.setColor('#3399ff')
		.setDescription(lang.credits_hintembed)
		.setAuthor(lang.credits_hint);

		userdb.creditsmessage = true;
		await client.userdb.set(msg.author.id, userdb);

		msg.author.send({ embed });
	}

	sql.get(`SELECT * FROM medals WHERE userId = "${user1.id}"`).then(row => {
		var embed = new Discord.RichEmbed()
		.setAuthor(user1.tag, user1.avatarURL)
		.setDescription(`${lenoxbotcoin} **${lang.credits_credits}** ${row.medals}`)
		.setColor('#009933');

		msg.channel.send({ embed });
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['balance'],
	userpermissions: [], dashboardsettings: false
};
exports.help = {
	name: 'credits',
	description: 'Shows you the credits of you or another user',
	usage: 'credits [@User]',
	example: ['credits @Monkeyyy11#7584'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
