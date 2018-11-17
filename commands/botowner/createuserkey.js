const settings = require('../../settings.json');
const keygenerator = require('../../utils/keygenerator.js');
exports.run = async (client, msg, args, lang) => {
	const Discord = require('discord.js');
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

	const botconfspremiumload = client.botconfs.get('premium');

	let key = '';

	for (let i = 0; i < 1000; i++) {
		key = keygenerator.generateKey();

		if (!botconfspremiumload.keys.userkeys.includes(key)) {
			break;
		}

		if (i === 999) {
			key = undefined;
		}
	}

	if (key !== undefined) {
		botconfspremiumload.keys.userkeys.push(key);
	}

	client.botconfs.set('premium', botconfspremiumload);

	const embeddescription = lang.createuserkey_embeddescription.replace('%premiumcode', key);
	const embed = new Discord.RichEmbed()
		.setDescription(embeddescription)
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.setTimestamp()
		.setColor('#cc99ff')
		.setTitle(lang.createuserkey_embedtitle);
	await client.channels.get(settings.keychannel).send({ embed });

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
