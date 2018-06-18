exports.run = async(client, msg, args, lang) => {
	const input = args.slice();
	const botconfspremiumload = client.botconfs.get('premium');
	const userdb = client.userdb.get(msg.author.id);
	const Discord = require('discord.js');
	const moment = require('moment');
	require('moment-duration-format');
	const ms = require('ms');

	if (!input || input.length === 0) return msg.reply(lang.useractivatekey_noinput);
	if (isNaN(input.join(" "))) return msg.reply(lang.useractivatekey_error);
	if (botconfspremiumload.keys.numberofuserkeys < input.join(" ")) return msg.reply(lang.useractivatekey_notexist);

	if (botconfspremiumload.keys.redeemeduserkeys.includes(input.join(" "))) return msg.reply(lang.useractivatekey_already);

	if (userdb.premium.status === false) {
	userdb.premium.status = true;
	userdb.premium.bought.push(new Date().getTime);

	const now = new Date().getTime();
	userdb.premium.end = new Date(now + 15552000000);

	botconfspremiumload.keys.redeemeduserkeys.push(input.join(" "));

	await client.userdb.set(msg.author.id, userdb);
	await client.botconfs.set('premium', botconfspremiumload);

	const timestamps = client.cooldowns.get('useractivatekey');
	timestamps.delete(msg.author.id);

	const embed = new Discord.RichEmbed()
	.setDescription(`This user used a premium userkey (Code: ${input.join(" ")})! \n\nThis user has premium until ${userdb.premium.end.toUTCString()}`)
	.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
	.setTimestamp()
	.setColor('#66ff33')
	.setTitle('New Userkey used!');
	await client.channels.get('419877966265319424').send({ embed });

	const redeemed = lang.useractivatekey_redeemed.replace('%date', `\`${userdb.premium.end.toUTCString()}\``);
	return msg.reply(redeemed);
	} else {
	userdb.premium.bought.push(new Date().getTime);

	userdb.premium.end = new Date(Date.parse(userdb.premium.end) + 15552000000);

	botconfspremiumload.keys.redeemeduserkeys.push(input.join(" "));

	await client.userdb.set(msg.author.id, userdb);
	await client.botconfs.set('premium', botconfspremiumload);

	const timestamps = client.cooldowns.get('useractivatekey');
	timestamps.delete(msg.author.id);

	const embed = new Discord.RichEmbed()
	.setDescription(`This user used a premium userkey (Code: ${input.join(" ")})! \n\nThis user has premium until ${new Date(Date.parse(userdb.premium.end) + 15552000000).toUTCString()}`)
	.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
	.setTimestamp()
	.setColor('#66ff33')
	.setTitle('Userkey used!');
	client.channels.get('419877966265319424').send({ embed });

	const extended = lang.useractivatekey_extended.replace('%date', `\`${new Date(Date.parse(userdb.premium.end) + 15552000000).toUTCString()}\``);
	return msg.reply(extended);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
	userpermissions: [],
=======
	userpermissions: [], dashboardsettings: false,
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
	cooldown: 43200000
};
exports.help = {
	name: 'useractivatekey',
	description: 'With this command you can use a premium userkey',
	usage: 'useractivatekey {key}',
	example: ['useractivatekey 122'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
