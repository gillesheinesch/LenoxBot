const settings = require('../../settings.json');
exports.run = async (client, msg, args, lang) => {
	const Discord = require('discord.js');
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

	const botconfspremiumload = await client.botconfs.get('premium');
	botconfspremiumload.keys.numberofuserkeys += 1;
	await client.botconfs.set('premium', botconfspremiumload);

	const embeddescription = lang.createuserkey_embeddescription.replace('%premiumcode', botconfspremiumload.keys.numberofuserkeys);
	const embed = new Discord.RichEmbed()
		.setDescription(embeddescription)
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.setTimestamp()
		.setColor('#cc99ff')
		.setTitle(lang.createuserkey_embedtitle);
	await client.channels.get('497400179201277992').send({ embed });

	msg.reply(lang.createuserkey_message);
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
	name: 'createuserkey',
	description: 'Creates a premium userkey',
	usage: 'createuserkey',
	example: ['createuserkey'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
