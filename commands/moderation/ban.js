const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const reason = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) {
		try {
			if (!msg.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('User not found!');
			user = msg.guild.members.get(args.slice(0, 1).join(' '));
			user = user.user;
		} catch (error) {
			return msg.reply(lang.ban_idcheck);
		}
	}

	if (user === msg.author) return msg.channel.send(lang.ban_yourself);
	if (!reason) return msg.reply(lang.ban_noinput);

	if (!msg.guild.member(user).bannable) return msg.reply(lang.ban_nopermission);
	msg.guild.ban(user);

	const banned = lang.ban_banned.replace('%usertag', user.tag);
	const banembed = new Discord.RichEmbed()
		.setColor('#99ff66')
		.setDescription(`✅ ${banned}`);
	msg.channel.send({ embed: banembed });

	const bandescription = lang.ban_bandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason);
	const embed = new Discord.RichEmbed()
		.setAuthor(`${lang.ban_bannedby} ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(bandescription);

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Ban',
	aliases: ['b'],
	userpermissions: ['BAN_MEMBERS'],
	dashboardsettings: true
};
exports.help = {
	name: 'ban',
	description: 'Ban a user from the discord server with a certain reason',
	usage: 'ban {@User/UserID} {reason}',
	example: ['ban @Monkeyyy11#7584 Toxic behavior', 'ban 406177968252256257 Spam'],
	category: 'moderation',
	botpermissions: ['BAN_MEMBERS', 'SEND_MESSAGES']
};

