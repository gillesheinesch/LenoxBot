const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	let reason = args.slice(2).join(' ');
	let days = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply(lang.softban_nomention).then(m => m.delete(10000));
	if (user === msg.author) return msg.channel.send(lang.softban_yourself);
	if (!days[0]) return msg.reply(lang.softban_daysundefined);
	if (isNaN(days[0]) === true) return msg.reply(lang.softban_nonumber);
	if (parseInt(days[0]) > 8) return msg.reply(lang.softban_max7);
	if (!reason) return msg.reply(lang.softban_noinput).then(m => m.delete(10000));

	if (!msg.guild.member(user).bannable) return msg.reply(lang.softban_nopermission).then(m => m.delete(10000));
	await msg.guild.ban(user, { days: days[0] });
	await msg.guild.unban(user);

	var softbanned = lang.softban_softbanned.replace('%usertag', user.tag).replace('%days', days[0]);
	const softbanembed = new Discord.RichEmbed()
	.setColor('#99ff66')
	.setDescription(`✅ ${softbanned}`);
	msg.channel.send({ embed: softbanembed });

	var softbanby = lang.softban_softbanby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	var softbandescription = lang.softban_softbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason).replace('%days', days[0]);
	const embed = new Discord.RichEmbed()
	.setAuthor(softbanby, msg.author.displayAvatarURL)
	.setThumbnail(user.displayAvatarURL)
	.setColor('#FF0000')
	.setTimestamp()
	.setDescription(softbandescription);

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
	userpermissions: ['BAN_MEMBERS']
=======
	userpermissions: ['BAN_MEMBERS'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'softban',
	description: 'Bans a user and deletes his messages of the last X days. After that, he will be unbaned immediately!',
	usage: 'softban @User {days} {reason}',
	example: ['softban @Monkeyyy11#7584 7 Spam'],
	category: 'moderation',
	botpermissions: ['BAN_MEMBERS', 'SEND_MESSAGES']
};

