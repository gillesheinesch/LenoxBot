exports.run = async (client, msg, args, lang) => {
	const input = args.slice();
	const botconfspremiumload = client.botconfs.get('premium');
	const tableload = client.guildconfs.get(msg.guild.id);
	const Discord = require('discord.js');
	const moment = require('moment');
	require('moment-duration-format');
	const ms = require('ms');

	if (!input || input.length === 0) return msg.reply(lang.serveractivatekey_noinput);
	if (isNaN(input.join(" "))) return msg.reply(lang.serveractivatekey_error);
	if (botconfspremiumload.keys.numberofguildkeys < input.join(" ")) return msg.reply(lang.serveractivatekey_notexist);

	if (botconfspremiumload.keys.redeemedguildkeys.includes(input.join(" "))) return msg.reply(lang.serveractivatekey_already);

	if (tableload.premium.status === false) {
		tableload.premium.status = true;
		tableload.premium.bought.push(new Date().getTime);

		const now = new Date().getTime();
		tableload.premium.end = new Date(now + 7776000000);

		botconfspremiumload.keys.redeemedguildkeys.push(input.join(" "));

		await client.guildconfs.set(msg.author.id, tableload);
		await client.botconfs.set('premium', botconfspremiumload);

		const timestamps = client.cooldowns.get('serveractivatekey');
		timestamps.delete(msg.author.id);

		const embed = new Discord.RichEmbed()
			.setDescription(`This discord server used a premium serverkey (Code: ${input.join(" ")})! \n\nThis discord server has premium until ${tableload.premium.end.toUTCString()}`)
			.setAuthor(`Serverkey used by ${msg.author.tag} for ${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL)
			.setTimestamp()
			.setColor('#ff0000')
			.setTitle('New Serverkey used!');
		await client.channels.get('419877966265319424').send({
			embed
		});

		const redeemed = lang.serveractivatekey_redeemed.replace('%date', `\`${tableload.premium.end.toUTCString()}\``);
		return msg.reply(redeemed);
	} else {
		tableload.premium.bought.push(new Date().getTime);

		tableload.premium.end = new Date(Date.parse(tableload.premium.end) + 7776000000);

		botconfspremiumload.keys.redeemedguildkeys.push(input.join(" "));

		await client.guildconfs.set(msg.author.id, tableload);
		await client.botconfs.set('premium', botconfspremiumload);

		const timestamps = client.cooldowns.get('serveractivatekey');
		timestamps.delete(msg.author.id);

		const embed = new Discord.RichEmbed()
			.setDescription(`This discord server used a premium serverkey (Code: ${input.join(" ")})! \n\nThis discord server has premium until ${new Date(Date.parse(tableload.premium.end) + 7776000000).toUTCString()}`)
			.setAuthor(`Serverkey used by ${msg.author.tag} for ${msg.guild.name} (${msg.guild.id})`, msg.guild.iconURL)
			.setTimestamp()
			.setColor('#ff0000')
			.setTitle('New Serverkey used!');
		client.channels.get('419877966265319424').send({
			embed
		});

		const extended = lang.serveractivatekey_extended.replace('%date', `\`${new Date(Date.parse(tableload.premium.end) + 7776000000).toUTCString()}\``);
		return msg.reply(extended);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
	dashboardsettings: false,
	cooldown: 43200000
};
exports.help = {
	name: 'useserverkey',
	description: 'Displays the points of you or a user',
	usage: 'serveractivatekey {key}',
	example: ['serveractivatekey 1122'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
