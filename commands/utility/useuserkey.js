const settings = require('../../settings.json');
exports.run = async (client, msg, args, lang) => {
	const input = args.slice();
	const botconfspremiumload = client.botconfs.get('premium');
	const userdb = client.userdb.get(msg.author.id);
	const Discord = require('discord.js');

	if (!input || input.length === 0) return msg.reply(lang.useuserkey_noinput);
	if (!botconfspremiumload.keys.userkeys.includes(input.join(' '))) return msg.reply(lang.useuserkey_notexist);
	if (botconfspremiumload.keys.redeemeduserkeys.includes(input.join(' '))) return msg.reply(lang.useuserkey_already);

	if (userdb.premium.status === false) {
		userdb.premium.status = true;
		userdb.premium.bought.push(new Date().getTime);

		const now = new Date().getTime();
		userdb.premium.end = new Date(now + 15552000000);

		botconfspremiumload.keys.redeemeduserkeys.push(input.join(' '));

		client.userdb.set(msg.author.id, userdb);
		client.botconfs.set('premium', botconfspremiumload);

		const timestamps = client.cooldowns.get('useuserkey');
		delete timestamps[msg.author.id];
		client.cooldowns.set('useuserkey', timestamps);

		const embed = new Discord.RichEmbed()
			.setDescription(`This user used a premium userkey (Code: ${input.join(' ')})! \n\nThis user has premium until ${userdb.premium.end.toUTCString()}`)
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
			.setTimestamp()
			.setColor('#66ff33')
			.setTitle('New Userkey used!');
		await client.channels.get(settings.keychannel).send({ embed });

		const redeemed = lang.useuserkey_redeemed.replace('%date', `\`${userdb.premium.end.toUTCString()}\``);
		return msg.reply(redeemed);
	}
	userdb.premium.bought.push(new Date().getTime);

	userdb.premium.end = new Date(Date.parse(userdb.premium.end) + 15552000000);

	botconfspremiumload.keys.redeemeduserkeys.push(input.join(' '));

	client.userdb.set(msg.author.id, userdb);
	client.botconfs.set('premium', botconfspremiumload);

	const timestamps = client.cooldowns.get('useuserkey');
	delete timestamps[msg.author.id];
	client.cooldowns.set('useuserkey', timestamps);

	const embed = new Discord.RichEmbed()
		.setDescription(`This user used a premium userkey (Code: ${input.join(' ')})! \n\nThis user has premium until ${new Date(Date.parse(userdb.premium.end + 15552000000)).toUTCString()}`)
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.setTimestamp()
		.setColor('#66ff33')
		.setTitle('Userkey used!');
	await client.channels.get(settings.keychannel).send({ embed });

	const extended = lang.useuserkey_extended.replace('%date', `\`${new Date(Date.parse(userdb.premium.end) + 15552000000).toUTCString()}\``);
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
	name: 'useuserkey',
	description: 'With this command you can use a premium userkey',
	usage: 'useuserkey {key}',
	example: ['useuserkey 122'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
