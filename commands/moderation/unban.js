const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	let reason = args.slice(1).join(' ');
	client.unbanReason = reason;
	client.unbanAuth = msg.author;
	let user = args[0];
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply(lang.unban_nouserid).then(m => m.delete(10000));
	if (!reason) return msg.reply(lang.unban_noinput).then(m => m.delete(10000));

	const bans = await msg.guild.fetchBans();
	if (!bans.get(user)) return msg.reply(lang.unban_notbanned);

	msg.guild.unban(user);

	var unbanned = lang.unban_unbanned.replace('%userid', user);
	const unbanembed = new Discord.RichEmbed()
	.setColor('#99ff66')
	.setDescription(`✅ ${unbanned}`);
	msg.channel.send({ embed: unbanembed });

	var unbannedby = lang.unban_unbannedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	var unbandescription = lang.unban_unbandescription.replace('%userid', user).replace('%reason', reason);
	const embed = new Discord.RichEmbed()
		.setAuthor(unbannedby, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor(0x00AE86)
		.setTimestamp()
		.setDescription(unbandescription);
		
		if (tableload.modlog === 'true') {
			const modlogchannel = client.channels.get(tableload.modlogchannel);
		return modlogchannel.send({ embed: embed });
		}
	};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['u'],
    userpermissions: ['BAN_MEMBERS']
};
exports.help = {
	name: 'unban',
	description: 'Unban a user from the discord server with a certain reason',
	usage: 'unban {userid} {reason}',
	example: ['unban 238590234135101440 Mistake'],
	category: 'moderation',
    botpermissions: ['BAN_MEMBERS', 'MANAGE_GUILD', 'SEND_MESSAGES']
};
