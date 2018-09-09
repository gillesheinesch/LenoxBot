exports.run = async (client, msg, args, lang) => {
	const Discord = require('discord.js');
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	const botconfspremiumload = await client.botconfs.get('premium');
	botconfspremiumload.keys.numberofguildkeys = botconfspremiumload.keys.numberofguildkeys + 1;
	await client.botconfs.set('premium', botconfspremiumload);

	const embeddescription = lang.createserverkey_embeddescription.replace('%premiumcode', botconfspremiumload.keys.numberofguildkeys);
	const embed = new Discord.RichEmbed()
		.setDescription(lang.embeddescription)
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.setTimestamp()
		.setColor('#cc99ff')
		.setTitle(lang.createserverkey_embedtitle);
	await client.channels.get('419877966265319424').send({ embed });

	msg.reply(lang.createserverkey_message);
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
	name: 'createserverkey',
	description: 'Creates a premium serverkey',
	usage: 'createserverkey',
	example: ['createserverkey'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
