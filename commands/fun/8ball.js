const Discord = require(`discord.js`);
exports.run = (client, msg, args) => {
	const eightball = require('8ball')();
	if (args.length < 1) return msg.channel.send('You have to specify what you want to ask the bot?').then(m => m.delete(10000));

	const embed = new Discord.RichEmbed()
	.addField('Your Question', args.join(" "))
	.addField('Answer', eightball)
	.setColor('#ff6666')
	.setAuthor(msg.author.tag, msg.author.displayAvatarURL);
	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['pc'],
	userpermissions: []
};
exports.help = {
	name: '8ball',
	description: 'Selects a random number between your input and 1',
	usage: 'randomnumber {input}',
	example: 'randomnumber 100',
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
