const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const reason = args.slice(2).join(' ');
	const days = args.slice(1).join(' ');
	const user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply(lang.softban_nomention);
	if (user === msg.author) return msg.channel.send(lang.softban_yourself);
	if (!days[0]) return msg.reply(lang.softban_daysundefined);
	if (isNaN(days[0]) === true) return msg.reply(lang.softban_nonumber);
	if (parseInt(days[0], 10) < 1) return msg.reply(lang.softban_min1);
	if (parseInt(days[0], 10) > 8) return msg.reply(lang.softban_max7);
	if (!reason) return msg.reply(lang.softban_noinput);

	if (!msg.guild.member(user).bannable) return msg.reply(lang.softban_nopermission);
	await msg.guild.ban(user, { days: days[0] });
	await msg.guild.unban(user);

	const softbanned = lang.softban_softbanned.replace('%usertag', user.tag).replace('%days', days[0]);
	const softbanembed = new Discord.RichEmbed()
		.setColor('#99ff66')
		.setDescription(`✅ ${softbanned}`);
	msg.channel.send({ embed: softbanembed });

	const softbanby = lang.softban_softbanby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	const softbandescription = lang.softban_softbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason)
		.replace('%days', days[0]);
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
	shortDescription: 'Ban',
	aliases: [],
	userpermissions: ['BAN_MEMBERS'],
	dashboardsettings: true
};
exports.help = {
	name: 'softban',
	description: 'Bans a user and deletes his messages of the last X days. After that, he will be unbaned immediately!',
	usage: 'softban @User {days} {reason}',
	example: ['softban @Monkeyyy11#7584 7 Spam'],
	category: 'moderation',
	botpermissions: ['BAN_MEMBERS', 'SEND_MESSAGES']
};

