const Discord = require(`discord.js`);
exports.run = (client, msg, args, lang) => {
	let randomsize = [lang.penissizecalculator_1,
		lang.penissizecalculator_2,
		lang.penissizecalculator_3,
		lang.penissizecalculator_4,
		lang.penissizecalculator_5];
	var rand = Math.floor(Math.random() * randomsize.length);

	if (!msg.mentions.members.first()) {
		return msg.channel.send(`${msg.author}, ${randomsize[rand]}`);
	} else {
		msg.channel.send(`${msg.mentions.members.first()}, ${randomsize[rand]}`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['psc'],
	userpermissions: []
};
exports.help = {
	name: 'penissizecalculator',
	description: 'Calculates the size of the penis of you or a user',
	usage: 'penissizecalculator [@User]',
	example: ['randomnumber @Tester#8234'],
	category: 'fun',
	botpermissions: ['SEND_MESSAGES']
};
