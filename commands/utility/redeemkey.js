exports.run = async (client, msg, args, lang) => {
	const redeemload = client.redeem.get(msg.author.id);
	const randomkey = require('randomkey');
	const Discord = require('discord.js');

	if (msg.guild.id !== '352896116812939264') return msg.channel.send(`${lang.redeem_notlenoxbotdiscordserver} https://discord.gg/c7DUz35`);

	if (redeemload.redeemkey === '') {
		const key = randomkey(16, randomkey.numbers);

		const array = [];
		client.redeem.map(userid => array.push(userid.redeemkey));

		if (array.includes(key)) return msg.reply(lang.redeemkey_error);

		redeemload.redeemkey = key;
		redeemload.redeemkeyowner = msg.author.id;
		await client.redeem.set(msg.author.id, redeemload);
	}

	if (redeemload.redeemkey !== '') {
		var embeddescription = lang.redeemkey_embeddescription.replace('%redeemkey', `**${redeemload.redeemkey}**`);
	const embed = new Discord.RichEmbed()
		.setDescription(embeddescription)
		.setColor('#99ff66')
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL);

	msg.channel.send({
		embed
	});
}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'redeemkey',
	description: 'Shows you your redeem key so that other users can redeem it',
	usage: 'redeemkey',
	example: ['redeemkey'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
