exports.run = (client, msg, args, lang) => {
	const Discord = require('discord.js');

	const embeddescription = lang.vote_embeddescription.replace('%link', `https://discordbots.org/bot/lenoxbot/vote`);
	const embed = new Discord.RichEmbed()
		.setAuthor(lang.vote_embedauthor)
		.setColor('')
		.setDescription(embeddescription);

	return msg.channel.send({
		embed: embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Help',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'vote',
	description: 'All details about voting for LenoxBot',
	usage: 'vote',
	example: ['vote'],
	category: 'help',
	botpermissions: ['SEND_MESSAGES']
};
