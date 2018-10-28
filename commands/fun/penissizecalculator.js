exports.run = (client, msg, args, lang) => {
	const pscAnswers = [];
	for (const x in lang) {
		if (x.includes('penissizecalculator_answer')) {
			pscAnswers.push(lang[x]);
		}
	}
	const pscAnswersIndex = Math.floor(Math.random() * pscAnswers.length);

	if (!msg.mentions.members.first()) {
		return msg.channel.send(`${msg.author}, ${pscAnswers[pscAnswersIndex]}`);
	}
	msg.channel.send(`${msg.mentions.members.first().displayName}, ${pscAnswers[pscAnswersIndex]}`);
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
