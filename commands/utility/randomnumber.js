const Discord = require(`discord.js`);
exports.run = (client, msg, args, lang) => {
	const input = parseInt(args.slice().join(' '), 10);
	const randomnumberfinished = Math.floor((Math.random() * input) + 1);

	if (!input) return msg.reply(lang.randomnumber_number);

	const randomnumber = lang.randomnumber_randomnumber.replace('%randomnumber', randomnumberfinished);
	const embed = new Discord.RichEmbed()
		.setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
		.setColor('#0066CC')
		.setDescription(randomnumber);
	msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: ['rn'],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'randomnumber',
	description: 'Selects a random number between your input and 1',
	usage: 'randomnumber {input}',
	example: ['randomnumber 100'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
