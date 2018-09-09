const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const input = args.slice();

	if (!input || input.length === 0) return msg.reply(lang.embed_error);
	if (input.join(' ').length > 1000) return msg.reply(lang.embed_toobig);

	const embedinput = input.join(' ').replace('//', '\n');
	const embed = new Discord.RichEmbed()
		.setDescription(embedinput)
		.setColor('#66ff66');

	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'embed',
	description: 'Create an embed for you with any text. Use // to go to a new line',
	usage: 'embed {text}',
	example: ['embed Welcome on this discord server! Here is a list of all rules on this discord server...'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
