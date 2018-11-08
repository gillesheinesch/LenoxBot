const settings = require('../../settings.json');
const keygenerator = require('../../utility/keygenerator.js');
exports.run = async (client, msg, args, lang) => {
	const Discord = require('discord.js');
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

	const botconfspremiumload = await client.botconfs.get('premium');

	let key = '';

	for (let i = 0; i < 1000; i++) {
		key = keygenerator.generateKey();

		if (!botconfspremiumload.keys.guildkeys.includes(key)) {
			break;
		}

		if (i === 999) {
			key = undefined;
		}
	}

	if (key !== undefined) {
		botconfspremiumload.keys.guildkeys.push(key);
	}

	await client.botconfs.set('premium', botconfspremiumload);

	const embeddescription = lang.createserverkey_embeddescription.replace('%premiumcode', key);
	const embed = new Discord.RichEmbed()
		.setDescription(embeddescription)
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.setTimestamp()
		.setColor('#cc99ff')
		.setTitle(lang.createserverkey_embedtitle);
	await client.channels.get(settings.botdiscord).send({ embed });

	return msg.reply(lang.createserverkey_message);
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
