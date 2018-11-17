const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const reason = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) {
		try {
			if (!msg.guild.members.get(args.slice(0, 1).join(' '))) throw new Error('User not found!');
			user = msg.guild.members.get(args.slice(0, 1).join(' '));
			user = user.user;
		} catch (error) {
			return msg.reply(lang.warn_idcheck);
		}
	}

	if (user === msg.author) return msg.channel.send(lang.warn_yourself);
	if (!reason) return msg.reply(lang.warn_noinput);

	const warned = lang.warn_warned.replace('%usertag', user.tag);
	const warnembed = new Discord.RichEmbed()
		.setColor('#99ff66')
		.setDescription(`✅ ${warned}`);
	msg.channel.send({ embed: warnembed });

	const warnedby = lang.warn_warnedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	const warndescription = lang.warn_warndescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason);
	const embed = new Discord.RichEmbed()
		.setAuthor(warnedby, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#fff024')
		.setTimestamp()
		.setDescription(warndescription);

	user.send({ embed: embed });

	if (!tableload.warnlog) {
		tableload.warnlog = [];
		client.guildconfs.set(msg.guild.id, tableload);
	}

	await tableload.warnlog.push(user.id);
	await tableload.warnlog.push(new Date().getTime());
	await tableload.warnlog.push(reason);
	await tableload.warnlog.push(msg.author.id);
	client.guildconfs.set(msg.guild.id, tableload);

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Warn',
	aliases: ['w'],
	userpermissions: ['KICK_MEMBERS'],
	dashboardsettings: true
};
exports.help = {
	name: 'warn',
	description: 'Warn a user on the discord server with a certain reason',
	usage: 'warn {@User/UserID} {reason}',
	example: ['warn @Monkeyyy11#7584 Spam'],
	category: 'moderation',
	botpermissions: ['KICK_MEMBERS', 'SEND_MESSAGES']
};
