const settings = require('../../settings.json');
exports.run = async (client, msg, args, lang) => {
	const input = args.slice();
	const botconfspremiumload = client.botconfs.get('premium');
	const tableload = client.guildconfs.get(msg.guild.id);
	const Discord = require('discord.js');

	if (!input || input.length === 0) return msg.reply(lang.useserverkey_noinput);
	if (!botconfspremiumload.keys.guildkeys.includes(input.join(' '))) return msg.reply(lang.useserverkey_notexist);
	if (botconfspremiumload.keys.redeemedguildkeys.includes(input.join(' '))) return msg.reply(lang.useserverkey_already);

	if (tableload.premium.status === false) {
		tableload.premium.status = true;
		tableload.premium.bought.push(new Date().getTime);

		const now = new Date().getTime();
		tableload.premium.end = new Date(now + 7776000000);

		botconfspremiumload.keys.redeemedguildkeys.push(input.join(' '));

		client.guildconfs.set(msg.guild.id, tableload);
		client.botconfs.set('premium', botconfspremiumload);

		const timestamps = client.cooldowns.get('useserverkey');
		delete timestamps[msg.author.id];
		client.cooldowns.set('useserverkey', timestamps);

		const embed = new Discord.RichEmbed()
			.setDescription(`This discord server used a premium serverkey (Code: ${input.join(' ')})! \n\nThis discord server has premium until ${tableload.premium.end.toUTCString()}`)
			.setAuthor(`Serverkey used by ${msg.author.tag} for ${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL)
			.setTimestamp()
			.setColor('#ff0000')
			.setTitle('New Serverkey used!');
		await client.channels.get(settings.keychannel).send({ embed });
		const redeemed = lang.useserverkey_redeemed.replace('%date', `\`${tableload.premium.end.toUTCString()}\``);
		return msg.reply(redeemed);
	}
	tableload.premium.bought.push(new Date().getTime);

	tableload.premium.end = new Date(Date.parse(tableload.premium.end) + 7776000000);

	botconfspremiumload.keys.redeemedguildkeys.push(input.join(' '));

	client.guildconfs.set(msg.guild.id, tableload);
	client.botconfs.set('premium', botconfspremiumload);

	const timestamps = client.cooldowns.get('useserverkey');
	delete timestamps[msg.author.id];
	client.cooldowns.set('useserverkey', timestamps);

	const embed = new Discord.RichEmbed()
		.setDescription(`This discord server used a premium serverkey (Code: ${input.join(' ')})! \n\nThis discord server has premium until ${new Date(Date.parse(tableload.premium.end) + 7776000000).toUTCString()}`)
		.setAuthor(`Serverkey used by ${msg.author.tag} for ${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL)
		.setTimestamp()
		.setColor('#ff0000')
		.setTitle('New Serverkey used!');
	await client.channels.get(settings.keychannel).send({ embed });

	const extended = lang.useserverkey_extended.replace('%date', `\`${new Date(Date.parse(tableload.premium.end) + 7776000000).toUTCString()}\``);
	return msg.reply(extended);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Premium',
	aliases: [],
	userpermissions: [],
	dashboardsettings: false,
	cooldown: 43200000
};
exports.help = {
	name: 'useserverkey',
	description: 'Displays the points of you or a user',
	usage: 'useserverkey {key}',
	example: ['useserverkey 1122'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
