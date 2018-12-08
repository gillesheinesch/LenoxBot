const Discord = require(`discord.js`);
exports.run = (client, msg, args, lang) => {
	const hangmanWords = [];
	for (const x in lang) {
		if (x.includes('hangman_wordtoguess')) {
			hangmanWords.push(lang[x]);
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'hangman',
	description: '',
	usage: '',
	example: [''],
	category: 'fun',
	botpermissions: ['SEND_MESSAGES']
};
