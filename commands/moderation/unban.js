const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	let reason = args.slice(1).join(' ');
	client.unbanReason = reason;
	client.unbanAuth = msg.author;
	let user = args[0];
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply('You must enter the userID to unban the user!').then(m => m.delete(10000));
	if (!reason) return msg.reply('You must specify a reason for the unban!').then(m => m.delete(10000));

	msg.guild.unban(user);
	msg.channel.send(`${user.tag} was successfully unbanned!`).then(m => m.delete(10000));

	const embed = new Discord.RichEmbed()
		.setAuthor(`Unbanned by ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor(0x00AE86)
		.setTimestamp()
		.setDescription(`**Action**: Unban \n**User**: ${user.username}#${user.discriminator} (${user.id}) \n**Reason**: ${reason}`);
		
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
	example: 'unban 238590234135101440 Mistake',
	category: 'moderation',
    botpermissions: ['BAN_MEMBERS', 'MANAGE_GUILD', 'SEND_MESSAGES']
};
