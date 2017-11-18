const Discord = require(`discord.js`);
exports.run = (client, msg, args) => {
	let randomsize = ["Your penis is 2.30 millimeters small. There's still more to go on!",
	"Your penis is 2.80 millimeters long. You did a major step forward, I'm proud of you!",
	"Your penis is 3.00 meters long. I think you set a new world record, congratulations!",
	"Your penis isn't even 1 millimeter small. I would recommend you to consult a doctor.",
	"Your penis is so small that there isn't a unit. Sorry!"];
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
	example: 'randomnumber @Tester#8234',
	category: 'fun',
	botpermissions: ['SEND_MESSAGES']
};
