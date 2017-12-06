const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	let reason = args.slice(1).join(' ');
	let user = msg.mentions.users.first();
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!user) return msg.reply('You must mention a user to warn!').then(m => m.delete(10000));
	if (!reason) return msg.reply('You must supply a reason for the warn!').then(m => m.delete(10000));


	msg.channel.send(`${user.tag} was successfully warned!`).then(m => m.delete(10000));

	const embed = new Discord.RichEmbed()
		.setAuthor(`Warned by ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#fff024')
		.setTimestamp()
		.setDescription(`**Action**: Warning \n**User**: ${user.username}#${user.discriminator} (${user.id}) \n**Reason**: ${reason}`);

	user.send({ embed: embed });

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
	return modlogchannel.send({ embed: embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['w'],
    userpermissions: ['KICK_MEMBERS']
};
exports.help = {
	name: 'warn',
	description: 'Warn a user on the discord server with a certain reason',
	usage: 'warn @User {reason}',
	example: ['warn @Monkeyyy11#7584 Spam'],
	category: 'moderation',
    botpermissions: ['KICK_MEMBERS', 'SEND_MESSAGES']
};
