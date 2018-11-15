const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const botconfs = client.botconfs.get('botconfs');
	let membermention = msg.mentions.members.first();
	let user = msg.mentions.users.first();

	const muteroleundefined = lang.unmute_muteroleundefined.replace('%prefix', tableload.prefix);
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

	if (!args.slice(1).join(' ')) return msg.channel.send(lang.unmute_noinput);

	const rolenotexist = lang.unmute_rolenotexist.replace('%prefix', tableload.prefix);
	if (!msg.guild.roles.get(tableload.muterole)) return msg.channel.send(rolenotexist);

	const role = msg.guild.roles.get(tableload.muterole);

	if (membermention.roles.has(tableload.muterole)) {
		await membermention.removeRole(role);

		const unmutedby = lang.unmute_unmutedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
		const unmutedescription = lang.unmute_unmutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', args.slice(1).join(' '));
		const embed = new Discord.RichEmbed()
			.setAuthor(unmutedby, msg.author.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(unmutedescription);

		user.send({
			embed: embed
		});

		if (tableload.modlog === 'true') {
			const modlogchannel = client.channels.get(tableload.modlogchannel);
			modlogchannel.send({
				embed: embed
			});
		}

		const unmuted = lang.unmute_unmuted.replace('%username', user.username);
		const unmuteembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${unmuted}`);
		msg.channel.send({
			embed: unmuteembed
		});

		let muteOfThisUser;
		for (const i in botconfs.mutes) {
			if (botconfs.mutes[i].discordserverid === membermention.guild.id && botconfs.mutes[i].memberid === membermention.id) {
				muteOfThisUser = botconfs.mutes[i];
				delete botconfs.mutes[muteOfThisUser.mutescount];
			}
		}

		client.botconfs.set('botconfs', botconfs);
	} else {
		const notownrole = lang.unmute_notownrole.replace('%username', user.username);
		msg.reply(notownrole);
	}
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
	name: 'unmute',
	description: 'Unmutes a user',
	usage: 'unmute {@User} {reason}',
	example: ['unmute @Tester#7352 Wrong mute'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
