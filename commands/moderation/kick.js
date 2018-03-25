const Discord = require('discord.js');

exports.run = async(client, msg, args, lang) => {
	let reason = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply(lang.kick_nomention).then(m => m.delete(10000));
	if (user === msg.author) return msg.channel.send(lang.kick_yourself);
	if (!reason) return msg.reply(lang.kick_noinput).then(m => m.delete(10000));

	if (!msg.guild.member(user).kickable) return msg.reply(lang.kick_nopermission).then(m => m.delete(10000));
	msg.guild.member(user).kick();

	var kicked = lang.kick_kicked.replace('%usertag', user.tag);
	msg.channel.send(kicked).then(m => m.delete(10000));

	var kickedby = lang.kick_kickedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	var kickdescription = lang.kick_kickdescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason);
	const embed = new Discord.RichEmbed()
		.setAuthor(kickedby, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(kickdescription);

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
	return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['k'],
    userpermissions: ['KICK_MEMBERS']
};
exports.help = {
	name: 'kick',
	description: 'Kick a user from the discord server with a certain reason',
	usage: 'kick @User {reason}',
	example: ['kick @Monkeyyy11#7584 Spam'],
	category: 'moderation',
    botpermissions: ['KICK_MEMBERS', 'SEND_MESSAGES']
};
