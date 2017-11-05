const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	let reason = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply('You must mention a user to ban!').then(m => m.delete(10000));
	if (!reason) return msg.reply('You must specify a reason for the ban!').then(m => m.delete(10000));

	if (!msg.guild.member(user).bannable) return msg.reply('I can not ban this user!').then(m => m.delete(10000));
	msg.guild.ban(user);
	msg.channel.send(`${user.tag} was successfully banned!`).then(m => m.delete(5000));

	const embed = new Discord.RichEmbed()
	.setAuthor(`Banned by ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
	.setThumbnail(user.displayAvatarURL)
	.setColor('#FF0000')
	.setTimestamp()
	.setDescription(`**Action**: Ban \n**User**: ${user.username}#${user.discriminator} (${user.id}) \n**Reason**: ${reason}`);

	user.send({ embed: embed });

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['b'],
    userpermissions: ['BAN_MEMBERS']
};
exports.help = {
	name: 'ban',
	description: 'Ban a user from the discord server with a certain reason',
	usage: 'ban @User {reason}',
	example: 'ban @Monkeyyy11#7584 Toxic behavior',
	category: 'moderation',
    botpermissions: ['BAN_MEMBERS', 'SEND_MESSAGES']
};

