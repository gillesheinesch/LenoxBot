const Discord = require('discord.js');
const ms = require('ms');

exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	let membermention = msg.mentions.members.first();
	let user = msg.mentions.users.first();

	var muteroleundefined = lang.mute_muteroleundefined.replace('%prefix', tableload.prefix);
	if (tableload.muterole === '') return msg.channel.send(muteroleundefined);
	if (!membermention) return msg.channel.send(lang.mute_nomention);
	if (!args.slice(1).join(' ')) return msg.channel.send(lang.mute_notime);
	if (!args.slice(2).join(' ')) return msg.channel.send(lang.mute_noinput);

	var rolenotexist = lang.mute_rolenotexist.replace('%prefix', tableload.prefix)
	if (!msg.guild.roles.get(tableload.muterole)) return msg.channel.send(rolenotexist);

	const role = msg.guild.roles.get(tableload.muterole);

	const mutetime = ms(args.slice(1, 2).join(" "));
	if (mutetime === undefined) return msg.channel.send(lang.mute_invalidtimeformat);

	var alreadymuted = lang.mute_alreadymuted.replace('%username', user.username);
	if (membermention.roles.get(tableload.muterole)) return msg.channel.send(alreadymuted);

	membermention.addRole(role);

	var mutedby = lang.mute_mutedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
	var mutedescription = lang.mute_mutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', args.slice(2).join(" ")).replace('%mutetime', ms(mutetime));
	const embed = new Discord.RichEmbed()
	.setAuthor(mutedby, msg.author.displayAvatarURL)
	.setThumbnail(user.displayAvatarURL)
	.setColor('#FF0000')
	.setTimestamp()
	.setDescription(mutedescription);

	user.send({ embed: embed });

	if (tableload.modlog === 'true') {
		const modlogchannel = client.channels.get(tableload.modlogchannel);
		modlogchannel.send({ embed: embed });
	}

	setInterval(function() { membermention.removeRole(role); }, mutetime);

	var muted = lang.mute_muted.replace('%username', user.username).replace('%mutetime', ms(mutetime));
	const muteembed = new Discord.RichEmbed()
	.setColor('#99ff66')
	.setDescription(`✅ ${muted}`);
	msg.channel.send({ embed: muteembed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['KICK_MEMBERS'],
	dashboardsettings: true
};

exports.help = {
	name: 'mute',
	description: 'Mutes a user for a certain time',
	usage: 'mute {@User} {time (d, h, m, s)} {reason}',
	example: ['mute @Tester#7362 1d Toxic behaviour'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
