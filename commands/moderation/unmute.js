const Discord = require('discord.js');
const ms = require('ms');

exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	let membermention = msg.mentions.members.first();
	let user = msg.mentions.users.first();

	if (tableload.muterole === '') return msg.channel.send(`First of all, you have to define the mute role by using the **${tableload.prefix}muterole** command`);
	if (!membermention) return msg.channel.send('You forgot to mention the user who has to be unmuted.');
	if (!args.slice(1).join(' ')) return msg.channel.send('You forgot to enter the reason for this unmute.');

    if (!msg.guild.roles.get(tableload.muterole)) return msg.channel.send(`It looks like this role does not exist anymore. Please define a new mute role with the **${tableload.prefix}muterole** command`)

	const role = msg.guild.roles.get(tableload.muterole);

	if (membermention.roles.get(tableload.muterole)) {
		membermention.removeRole(role);
		const embed = new Discord.RichEmbed()
		.setAuthor(`Unmuted by ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(`**Action**: Unmute \n**User**: ${user.username}#${user.discriminator} (${user.id}) \n**Reason**: ${args.slice(2).join(" ")}`);
	
		if (tableload.modlog === 'true') {
			const modlogchannel = client.channels.get(tableload.modlogchannel);
			modlogchannel.send({ embed: embed });
		}
		return msg.reply(`${user.username} was unmuted successfully.`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'unmute',
	description: 'Unmutes a user',
	usage: 'unmute {@User} {reason}',
	example: ['unmute @Tester#7352 Wrong mute'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
