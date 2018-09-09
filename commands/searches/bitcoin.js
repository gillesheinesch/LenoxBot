const Discord = require('discord.js');

exports.run = async (client, msg, args, lang) => {
	const btcValue = require('btc-value');

	const value = await btcValue();
	const percentage = await btcValue.getPercentageChangeLastDay();

	const descriptionembed = lang.bitcoin_descriptionembed.replace('%value', value).replace('%percentage', percentage);

	const embed = new Discord.RichEmbed()
		.setDescription(descriptionembed)
		.setColor('#ff6600')
		.setAuthor(lang.bitcoin_authorembed);

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
	name: 'bitcoin',
	description: 'Shows you information from Bitcoin (value and percentage of changes from the last day)',
	usage: 'bitcoin',
	example: ['bitcoin'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
