const Discord = require(`discord.js`);
exports.run = (client, msg, args, lang) => {
	const eightball = require('8ball')();
	if (args.length < 1) return msg.channel.send(lang.eightball_noinput);

	const embed = new Discord.RichEmbed()
		.addField(lang.eightball_question, args.join(' '))
		.addField(lang.eightball_answer, eightball)
		.setColor('#ff6666')
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL);

	return msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Games',
	aliases: ['eightball'],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'eightball',
	description: 'Ask the bot a question',
	usage: 'eightball {question}',
	example: ['eightball What is your name?'],
	category: 'fun',
	botpermissions: ['SEND_MESSAGES']
};
