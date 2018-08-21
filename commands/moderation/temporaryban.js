const Discord = require('discord.js');
const ms = require('ms');
exports.run = async (client, msg, args, lang) => {
	var reason = args.slice(2).join(' ');
	var time = args.slice(1, 2).join(' ');
	var user = msg.mentions.users.first();
	var membermention = msg.mentions.members.first();
	const botconfs = await client.botconfs.get('botconfs');
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) {
		try {
			if (!msg.guild.members.get(args.slice(0, 1).join(" "))) throw 'Usernotfound';
			user = msg.guild.members.get(args.slice(0, 1).join(" "));
			user = user.user;
		} catch (error) {
			return msg.reply(lang.ban_idcheck);
		}
	}

	if (user === msg.author) return msg.channel.send(lang.ban_yourself);
	if (!time) return msg.reply('No time given');
	if (!reason) return msg.reply(lang.ban_noinput);


	if (!msg.guild.member(user).bannable) return msg.reply(lang.ban_nopermission).then(m => m.delete(10000));
	msg.guild.ban(user);

	const bantime = ms(args.slice(1, 2).join(" "));
	if (bantime === undefined) return msg.channel.send(lang.temporaryban_invalidtimeformat);

	var banned = lang.temporaryban_banned.replace('%usertag', user.tag).replace('%bantime', ms(bantime));
	const banembed = new Discord.RichEmbed()
		.setColor('#99ff66')
		.setDescription(`✅ ${banned}`);
	msg.channel.send({
		embed: banembed
	});

	var bandescription = lang.temporaryban_bandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason).replace('%bantime', ms(bantime));
	var embed = new Discord.RichEmbed()
		.setAuthor(`${lang.temporaryban_bannedby} ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(bandescription);

	if (tableload.tempbananonymous === "true") {
		var bandescription = lang.temporaryban_bandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason).replace('%bantime', ms(bantime));
		const ananonymousembed = new Discord.RichEmbed()
			.setAuthor(`${lang.temporaryban_bannedby} ${client.user.username}${client.user.discriminator}`, client.user.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(bandescription);

		user.send({
			embed: ananonymousembed
		});
	} else {
		user.send({
			embed: embed
		});
	}

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		modlogchannel.send({
			embed: embed
		});
	}

	botconfs.banscount = botconfs.banscount + 1;

	const bansettings = {
		discordserverid: msg.guild.id,
		memberid: membermention.id,
		moderatorid: msg.author.id,
		reason: reason,
		bantime: bantime,
		banCreatedAt: Date.now(),
		banEndDate: Date.now() + bantime,
		banscount: botconfs.banscount
	};

	botconfs.bans[botconfs.banscount] = bansettings;
	await client.botconfs.set('botconfs', botconfs);

	setTimeout(async function () {
		const fetchedbans = await msg.guild.fetchBans();
		if (fetchedbans.has(user.id)) {
			await msg.guild.unban(user);

			var unbannedby = lang.unban_unbannedby.replace('%authortag', `${client.user.tag}`);
			var automaticbandescription = lang.temporaryban_automaticbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
			const unmutedembed = new Discord.RichEmbed()
				.setAuthor(unbannedby, client.user.displayAvatarURL)
				.setThumbnail(user.displayAvatarURL)
				.setColor('#FF0000')
				.setTimestamp()
				.setDescription(automaticbandescription);

			if (tableload.modlog === 'true') {
				const modlogchannel = client.channels.get(tableload.modlogchannel);
				await modlogchannel.send({
					embed: unmutedembed
				});
			}
		}
		delete botconfs.bans[botconfs.banscount];
		await client.botconfs.set('botconfs', botconfs);
	}, bantime);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['tempban'],
	userpermissions: ['BAN_MEMBERS'],
	dashboardsettings: true
};
exports.help = {
	name: 'temporaryban',
	description: 'Ban an user temporary!',
	usage: 'temporaryban {@User/UserID} {time (d, h, m, s)} {reason}',
	example: ['temporaryban @Monkeyyy11#0001 1d Toxic behaviour'],
	category: 'moderation',
	botpermissions: ['BAN_MEMBERS', 'SEND_MESSAGES']
};