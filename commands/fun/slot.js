const slotThing = [':grapes:', ':tangerine:', ':pear:', ':cherries:'];
const Discord = require('discord.js');

exports.run = (client, msg, args, lang) => {
	const slotOne = slotThing[Math.floor(Math.random() * slotThing.length)];
	const slotTwo = slotThing[Math.floor(Math.random() * slotThing.length)];
	const slotThree = slotThing[Math.floor(Math.random() * slotThing.length)];
	if (slotOne === slotTwo && slotOne === slotThree) {
		const embed1 = new Discord.RichEmbed()
		.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setColor('#3ADF00')
		.addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_triple);
		msg.channel.send({ embed: embed1 });
	} else 
	if (slotOne === slotTwo || slotTwo === slotThree) {
		const embed3 = new Discord.RichEmbed()
		.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setColor('#3ADF00')
		.addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_double);
		msg.channel.send({ embed: embed3 });
	} else {
	const embed2 = new Discord.RichEmbed()
	.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL)
	.setColor('#3ADF00')
	.addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_nothing);
		msg.channel.send({ embed: embed2 });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'slot',
	description: 'Play with the slot machine',
	usage: 'slot',
	example: ['slot'],
	category: 'fun',
    botpermissions: ['SEND_MESSAGES']
};
