const Discord = require('discord.js');
const ms = require('ms');
exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const botconfs = client.botconfs.get('botconfs');
	let membermention = msg.mentions.members.first();
	let user = msg.mentions.users.first();

	const muteroleundefined = lang.mute_muteroleundefined.replace('%prefix', tableload.prefix);
	if (tableload.muterole === '') return msg.channel.send(muteroleundefined);

	if (!user) {
		try {
			if (!msg.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('User not found!');
			user = msg.guild.members.get(args.slice(0, 1).join(' '));
			membermention = msg.guild.members.get(args.slice(0, 1).join(' '));
			user = user.user;
		} catch (error) {
			return msg.reply(lang.mute_idcheck);
		}
	}

	if (!args.slice(1).join(' ')) return msg.channel.send(lang.mute_notime);
	if (!args.slice(2).join(' ')) return msg.channel.send(lang.mute_noinput);

	const rolenotexist = lang.mute_rolenotexist.replace('%prefix', tableload.prefix);
	if (!msg.guild.roles.get(tableload.muterole)) return msg.channel.send(rolenotexist);

	const role = msg.guild.roles.get(tableload.muterole);

	const mutetime = ms(args.slice(1, 2).join(' '));
	if (typeof mutetime === 'undefined') return msg.channel.send(lang.mute_invalidtimeformat);

	const alreadymuted = lang.mute_alreadymuted.replace('%username', user.username);
	if (membermention.roles.get(tableload.muterole)) return msg.channel.send(alreadymuted);

	membermention.addRole(role);

	const mutedby = lang.mute_mutedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	const mutedescription = lang.mute_mutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', args.slice(2).join(' '))
		.replace('%mutetime', ms(mutetime));
	const embed = new Discord.RichEmbed()
		.setAuthor(mutedby, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(mutedescription);

	if (tableload.muteanonymous === 'true') {
		const anonymousembed = new Discord.RichEmbed()
			.setAuthor(mutedby, client.user.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(mutedescription);
		user.send({
			embed: anonymousembed
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

	botconfs.mutescount += 1;

	const mutesettings = {
		discordserverid: msg.guild.id,
		memberid: membermention.id,
		moderatorid: msg.author.id,
		reason: args.slice(2).join(' '),
		roleid: role.id,
		mutetime: mutetime,
		muteCreatedAt: Date.now(),
		muteEndDate: Date.now() + mutetime,
		mutescount: botconfs.mutescount
	};

	botconfs.mutes[botconfs.mutescount] = mutesettings;
	client.botconfs.set('botconfs', botconfs);

	const muted = lang.mute_muted.replace('%username', user.username).replace('%mutetime', ms(mutetime));
	const muteembed = new Discord.RichEmbed()
		.setColor('#99ff66')
		.setDescription(`✅ ${muted}`);
	msg.channel.send({
		embed: muteembed
	});

	setTimeout(async () => {
		if (tableload.muterole !== '' && membermention.roles.has(tableload.muterole)) {
			await membermention.removeRole(role);

			const unmutedby = lang.unmute_unmutedby.replace('%authortag', `${client.user.tag}`);
			const automaticunmutedescription = lang.unmute_automaticunmutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
			const unmutedembed = new Discord.RichEmbed()
				.setAuthor(unmutedby, client.user.displayAvatarURL)
				.setThumbnail(user.displayAvatarURL)
				.setColor('#FF0000')
				.setTimestamp()
				.setDescription(automaticunmutedescription);

			if (tableload.modlog === 'true') {
				const modlogchannel = client.channels.get(tableload.modlogchannel);
				await modlogchannel.send({
					embed: unmutedembed
				});
			}
		}
		delete botconfs.mutes[botconfs.mutescount];
		client.botconfs.set('botconfs', botconfs);
	}, mutetime);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Mute',
	aliases: [],
	userpermissions: ['KICK_MEMBERS'],
	dashboardsettings: true
};

exports.help = {
	name: 'mute',
	description: 'Mutes a user for a certain time',
	usage: 'mute {@User} {time (d, h, m, s)} {reason}',
	example: ['mute @Tester#7362 1d Toxic behaviour'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
