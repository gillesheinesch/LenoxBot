const Discord = require('discord.js');
const ms = require('ms');

exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	let membermention = msg.mentions.members.first();
	let user = msg.mentions.users.first();

	if (tableload.muterole === '') return msg.channel.send(`First of all, you have to define the mute role by using the **${tableload.prefix}muterole** command`);
	if (!membermention) return msg.channel.send('You forgot to mention the user who has to be muted.');
	if (!args.slice(1).join(' ')) return msg.channel.send('You forgot to enter how long you want to mute that user.');
	if (!args.slice(2).join(' ')) return msg.channel.send('You forgot to enter a reason for this mute.');

	if (!msg.guild.roles.get(tableload.muterole)) return msg.channel.send(`It looks like this role does not exist anymore. Please define a new mute role with the **${tableload.prefix}muterole** command`)

	const role = msg.guild.roles.get(tableload.muterole);

	const mutetime = ms(args.slice(1, 2).join(" "));
	if (mutetime === undefined) return msg.channel.send('You used an invalid format for your mute.');

	if (membermention.roles.get(tableload.muterole)) return msg.channel.send(`${user.username} is already muted.`);

	membermention.addRole(role);
	const embed = new Discord.RichEmbed()
	.setAuthor(`Muted by ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
	.setThumbnail(user.displayAvatarURL)
	.setColor('#FF0000')
	.setTimestamp()
	.setDescription(`**Action**: Mute \n**User**: ${user.username}#${user.discriminator} (${user.id}) \n**Reason**: ${args.slice(2).join(" ")} \n**Muted for**: ${ms(mutetime)}`);

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		modlogchannel.send({ embed: embed });
	}

	setInterval(function() { membermention.removeRole(role); }, mutetime);

	msg.channel.send(`${user.username} was muted successfully for ${ms(mutetime)}`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['KICK_MEMBERS']
};

exports.help = {
	name: 'mute',
	description: 'Mutes a user for a certain time',
	usage: 'mute {@User} {time (d, h, m, s)} {reason}',
	example: 'mute @Tester#7362 1d Toxic behaviour',
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
