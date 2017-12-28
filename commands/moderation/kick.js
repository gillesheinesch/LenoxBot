const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	let reason = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply('You must mention a user to kick!').then(m => m.delete(10000));
	if (user === msg.author) return msg.channel.send('You can not kick yourself!');
	if (!reason) return msg.reply('You must specify a reason for the kick!').then(m => m.delete(10000));

	if (!msg.guild.member(user).kickable) return msg.reply('I can not kick this user!').then(m => m.delete(10000));
	msg.guild.member(user).kick();
	msg.channel.send(`${user.tag} was successfully kicked!`).then(m => m.delete(10000));

	const embed = new Discord.RichEmbed()
		.setAuthor(`Kicked by ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(`**Action**: Kick \n**User**: ${user.username}#${user.discriminator} (${user.id}) \n**Reason**: ${reason}`);

	user.send({ embed });

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
