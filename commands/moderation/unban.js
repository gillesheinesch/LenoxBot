const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const botconfs = client.botconfs.get('botconfs');
	const reason = args.slice(1).join(' ');
	client.unbanReason = reason;
	client.unbanAuth = msg.author;
	const user = args[0];
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply(lang.unban_nouserid);
	if (!reason) return msg.reply(lang.unban_noinput);

	const bans = await msg.guild.fetchBans();
	if (!bans.get(user)) return msg.reply(lang.unban_notbanned);

	await msg.guild.unban(user);

	const unbanned = lang.unban_unbanned.replace('%userid', user);
	const unbanembed = new Discord.RichEmbed()
		.setColor('#99ff66')
		.setDescription(`✅ ${unbanned}`);
	msg.channel.send({
		embed: unbanembed
	});

	const unbannedby = lang.unban_unbannedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	const unbandescription = lang.unban_unbandescription.replace('%userid', user).replace('%reason', reason);
	const embed = new Discord.RichEmbed()
		.setAuthor(unbannedby, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor(0x00AE86)
		.setTimestamp()
		.setDescription(unbandescription);

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		modlogchannel.send({
			embed: embed
		});
	}

	let banOfThisUser;
	for (const i in botconfs.bans) {
		if (botconfs.bans[i].discordserverid === msg.guild.id && botconfs.mutes[i].memberid === user) {
			banOfThisUser = botconfs.bans[i];
		}
	}
	if (banOfThisUser) {
		delete botconfs.mutes[banOfThisUser.mutescount];
		client.botconfs.set('botconfs', botconfs);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Ban',
	aliases: ['u'],
	userpermissions: ['BAN_MEMBERS'],
	dashboardsettings: true
};
exports.help = {
	name: 'unban',
	description: 'Unban a user from the discord server with a certain reason',
	usage: 'unban {userID} {reason}',
	example: ['unban 238590234135101440 Mistake'],
	category: 'moderation',
	botpermissions: ['BAN_MEMBERS', 'MANAGE_GUILD', 'SEND_MESSAGES']
};
