const Discord = require('discord.js');
const ms = require('ms');
exports.run = (client, msg, args, lang) => {
	const reason = args.slice(2).join(' ');
	const time = args.slice(1, 2).join(' ');
	let user = msg.mentions.users.first();
	const membermention = msg.mentions.members.first();
	const botconfs = client.botconfs.get('botconfs');
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
	if (!time) return msg.reply('No time given');
	if (!reason) return msg.reply(lang.ban_noinput);


	if (!msg.guild.member(user).bannable) return msg.reply(lang.ban_nopermission);
	msg.guild.ban(user);

	const bantime = ms(args.slice(1, 2).join(' '));
	if (typeof bantime === 'undefined') return msg.channel.send(lang.temporaryban_invalidtimeformat);

	const banned = lang.temporaryban_banned.replace('%usertag', user.tag).replace('%bantime', ms(bantime));
	const banembed = new Discord.RichEmbed()
		.setColor('#99ff66')
		.setDescription(`✅ ${banned}`);
	msg.channel.send({
		embed: banembed
	});

	const bandescription = lang.temporaryban_bandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason)
		.replace('%bantime', ms(bantime));
	const embed = new Discord.RichEmbed()
		.setAuthor(`${lang.temporaryban_bannedby} ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(bandescription);

	if (tableload.tempbananonymous === 'true') {
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

	botconfs.banscount += 1;

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
	client.botconfs.set('botconfs', botconfs);

	setTimeout(async () => {
		const fetchedbans = await msg.guild.fetchBans();
		if (fetchedbans.has(user.id)) {
			await msg.guild.unban(user);

			const unbannedby = lang.unban_unbannedby.replace('%authortag', `${client.user.tag}`);
			const automaticbandescription = lang.temporaryban_automaticbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
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
		client.botconfs.set('botconfs', botconfs);
	}, bantime);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Ban',
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
