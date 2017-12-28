const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	let reason = args.slice(2).join(' ');
	let days = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply('You must mention a user to softban!').then(m => m.delete(10000));
	if (user === msg.author) return msg.channel.send('You can not softban yourself!');
	if (!days[0]) return msg.reply(`You haven't specified the number of days.`);
	if (isNaN(days[0]) === true) return msg.reply('You have to specify of how many days you want to have the messages of @User deleted! (Up to 7 days)');
	if (parseInt(days[0]) > 8) return msg.reply('You can only delete the messages up to the last 7 days.');
	if (!reason) return msg.reply('You must specify a reason for the softban!').then(m => m.delete(10000));

	if (!msg.guild.member(user).bannable) return msg.reply('I can not softban this user!').then(m => m.delete(10000));
	await msg.guild.ban(user, { days: days[0] });
	await msg.guild.unban(user);
	msg.channel.send(`${user.tag} was successfully softbaned and the messages of the last ${days[0]} days were deleted!`).then(m => m.delete(5000));

	const embed = new Discord.RichEmbed()
	.setAuthor(`Softban by ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
	.setThumbnail(user.displayAvatarURL)
	.setColor('#FF0000')
	.setTimestamp()
	.setDescription(`**Action**: Softban \n**User**: ${user.username}#${user.discriminator} (${user.id}) \n**Reason**: ${reason} \n**Messages of ${days[0]} got deleted`);

	user.send({ embed: embed });

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['BAN_MEMBERS']
};
exports.help = {
	name: 'softban',
	description: 'Bans a user and deletes his messages of the last X days. After that, he will be unbaned immediately!',
	usage: 'softban @User {days} {reason}',
	example: ['softban @Monkeyyy11#7584 7 Spam'],
	category: 'moderation',
	botpermissions: ['BAN_MEMBERS', 'SEND_MESSAGES']
};

