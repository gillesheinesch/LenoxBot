exports.run = (client, msg, args, lang) => {
	const randomsize = [lang.penissizecalculator_1,
		lang.penissizecalculator_2,
		lang.penissizecalculator_3,
		lang.penissizecalculator_4,
		lang.penissizecalculator_5,
		lang.penissizecalculator_6];
	const rand = Math.floor(Math.random() * randomsize.length);

	if (!msg.mentions.members.first()) {
		return msg.channel.send(`${msg.author}, ${randomsize[rand]}`);
	}
	msg.channel.send(`${msg.mentions.members.first().displayName}, ${randomsize[rand]}`);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Jokes',
	aliases: ['psc'],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'penissizecalculator',
	description: 'Calculates the size of the penis of you or a user',
	usage: 'penissizecalculator [@User]',
	example: ['penissizecalculator', 'penissizecalculator @Tester#8234'],
	category: 'fun',
	botpermissions: ['SEND_MESSAGES']
};
