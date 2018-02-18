const Discord = require('discord.js');
const ms = require('ms');

exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	let membermention = msg.mentions.members.first();
	let user = msg.mentions.users.first();

	var muteroleundefined = lang.unmute_muteroleundefined.replace('%prefix', tableload.prefix);
	if (tableload.muterole === '') return msg.channel.send(muteroleundefined);
	if (!membermention) return msg.channel.send(lang.unmute_nomention);
	if (!args.slice(1).join(' ')) return msg.channel.send(lang.unmute_noinput);

	var rolenotexist = lang.unmute_rolenotexist.replace('%prefix', tableload.prefix);
    if (!msg.guild.roles.get(tableload.muterole)) return msg.channel.send(rolenotexist);

	const role = msg.guild.roles.get(tableload.muterole);

	if (membermention.roles.get(tableload.muterole)) {
		membermention.removeRole(role);

		var unmutedby = lang.unmute_unmutedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
		var mutedescription = lang.mute_mutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', args.slice(2).join(" "));
		const embed = new Discord.RichEmbed()
		.setAuthor(unmutedby, msg.author.displayAvatarURL)
		.setThumbnail(user.displayAvatarURL)
		.setColor('#FF0000')
		.setTimestamp()
		.setDescription(mutedescription);
	
		if (tableload.modlog === 'true') {
			const modlogchannel = client.channels.get(tableload.modlogchannel);
			modlogchannel.send({ embed: embed });
		}
		var unmuted = lang.unmute_unmuted.replace('%username', user.username);
		return msg.reply(unmuted);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['KICK_MEMBERS']
};

exports.help = {
	name: 'unmute',
	description: 'Unmutes a user',
	usage: 'unmute {@User} {reason}',
	example: ['unmute @Tester#7352 Wrong mute'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
