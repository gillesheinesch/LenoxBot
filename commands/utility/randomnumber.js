const Discord = require(`discord.js`);
exports.run = (client, msg, args) => {
	let randomnumber = parseInt(args.slice().join(' '));
	let randomnumberfinished = Math.floor((Math.random() * randomnumber) + 1);

	if (!randomnumber) return msg.reply('You must enter a number!').then(m => m.delete(10000));
	const embed = new Discord.RichEmbed()
	.setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
    .setColor('#0066CC')
	.setDescription(`The random number is: **${randomnumberfinished}**`);
	msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['rn'],
    userpermissions: []
};
exports.help = {
	name: 'randomnumber',
	description: 'Selects a random number between your input and 1',
	usage: 'randomnumber {input}',
	example: ['randomnumber 100'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
