const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async(client, msg, args) => {
	const user1 = msg.mentions.users.first() || msg.author;
	sql.get(`SELECT * FROM medals WHERE userId = "${user1.id}"`).then(row => {
		var embed = new Discord.RichEmbed()
		.setAuthor(user1.tag, user1.avatarURL)
		.addField('Medals', row.medals)
		.setColor('#009933');

		msg.channel.send({ embed });
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'medals',
	description: 'Shows you the medals of you or another user',
	usage: 'medals [@User]',
	example: ['medals @Monkeyyy11#7584'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
