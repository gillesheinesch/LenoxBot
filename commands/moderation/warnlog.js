const Discord = require('discord.js');
const ms = require('ms');
exports.run = async(client, msg, args, lang) => {
	const mention = msg.mentions.users.first() || msg.author;
	const tableload = client.guildconfs.get(msg.guild.id);

	if (tableload.warnlog.length === 0) return msg.channel.send(lang.warnlog_error);

	var firstfield = [];
	var secondfield = [];

	const array = [];
	for (var i = 0; i < tableload.warnlog.length; i += 4) {
		if (mention.id === tableload.warnlog[i]) {
			array.push(true);
			const member = msg.guild.member(tableload.warnlog[i + 3]);

			var warnedbyandon = lang.warnlog_warnedbyandon.replace('%membername', member.displayName).replace('%date', new Date(tableload.warnlog[i + 1]));
			firstfield.push(warnedbyandon);
			secondfield.push(tableload.warnlog[i + 2]);
		}
	}

	if (array.length === 0) return msg.channel.send(lang.warnlog_notwarned);

	let embed = new Discord.RichEmbed()
	.setColor('#fff024')
	.setAuthor(mention.tag, mention.displayAvatarURL);

	const x = firstfield.slice(0, 5);
	const xx = secondfield.slice(0, 5);

	for (var i = 0; i < x.length; i++) {
		embed.addField(x[i], xx[i]);
	}

	const message = await msg.channel.send({ embed });

	await message.react('◀');
	await message.react('▶');

	var first = 0;
	var second = 5;

	var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 30000
	});
	collector.on('collect', r => {
		var reactionadd = firstfield.slice(first + 5, second + 5).length;
		var reactionremove = firstfield.slice(first - 5, second - 5).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			const thefirst = firstfield.slice(first + 5, second + 5);
			const thesecond = secondfield.slice(first + 5, second + 5);

			first = first + 5;
			second = second + 5;

			var newembed = new Discord.RichEmbed()
			.setColor('#fff024')
			.setAuthor(mention.tag, mention.displayAvatarURL);

			for (var i = 0; i < thefirst.length; i++) {
				newembed.addField(thefirst[i], thesecond[i]);
			}

			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			const thefirst = firstfield.slice(first - 5, second - 5);
			const thesecond = secondfield.slice(first - 5, second - 5);

			first = first - 5;
			second = second - 5;

			var newembed = new Discord.RichEmbed()
			.setColor('#fff024')
			.setAuthor(mention.tag, mention.displayAvatarURL);

			for (var i = 0; i < thefirst.length; i++) {
				newembed.addField(thefirst[i], thesecond[i]);
			}

			message.edit({
				embed: newembed
			});
		}
	});
	collector.on('end', (collected, reason) => {
		message.react('❌');
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['wl', 'warns'],
<<<<<<< HEAD
	userpermissions: ['KICK_MEMBERS']
=======
	userpermissions: ['KICK_MEMBERS'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'warnlog',
	description: 'Shows you the warnlog from you or a user',
	usage: 'warnlog [@User]',
	example: ['warnlog', 'warnlog @Monkeyyy11#7584'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
