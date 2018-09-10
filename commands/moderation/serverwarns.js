/* eslint-disable */
const Discord = require('discord.js');
const ms = require('ms');
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (tableload.warnlog.length === 0) return msg.channel.send(lang.warnlog_error);
	const firstfield = [];
	const secondfield = [];
	const array = [];
	for (var i = 0; i < tableload.warnlog.length; i += 4) {
		array.push(true);
		const member = msg.guild.member(tableload.warnlog[i + 3]) ? msg.guild.member(tableload.warnlog[i + 3]).displayName : tableload.warnlog[i + 3];
		const member2 = msg.guild.member(tableload.warnlog[i]) ? msg.guild.member(tableload.warnlog[i]).displayName : tableload.warnlog[i];
		const warnedbyandon = lang.serverwarns_warnedbyandon.replace('%membername', member).replace('%date', new Date(tableload.warnlog[i + 1])).replace('%username', member2);
		firstfield.push(warnedbyandon);
		secondfield.push(`${lang.serverwarns_reason} ${tableload.warnlog[i + 2]}`);
	}
	const embed = new Discord.RichEmbed()
		.setColor('#fff024')
		.setAuthor(msg.guild.name, msg.guild.iconURL);
	const x = firstfield.slice(0, 5);
	const xx = secondfield.slice(0, 5);
	for (var i = 0; i < x.length; i++) {
		embed.addField(x[i], xx[i]);
	}
	const message = await msg.channel.send({
		embed
	});
	if (tableload.warnlog.length / 4 <= 5) return undefined;
	const reaction1 = await message.react('◀');
	const reaction2 = await message.react('▶');
	let first = 0;
	let second = 5;
	const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 30000
	});
	collector.on('collect', r => {
		const reactionadd = firstfield.slice(first + 5, second + 5).length;
		const reactionremove = firstfield.slice(first - 5, second - 5).length;
		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);
			const thefirst = firstfield.slice(first + 5, second + 5);
			const thesecond = secondfield.slice(first + 5, second + 5);
			first += 5;
			second += 5;
			var newembed = new Discord.RichEmbed()
				.setColor('#fff024')
				.setAuthor(msg.guild.name, msg.guild.iconURL);
			for (var i = 0; i < thefirst.length; i++) {
				newembed.addField(thefirst[i], thesecond[i]);
			}
			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id);
			const thefirst = firstfield.slice(first - 5, second - 5);
			const thesecond = secondfield.slice(first - 5, second - 5);
			first -= 5;
			second -= 5;
			var newembed = new Discord.RichEmbed()
				.setColor('#fff024')
				.setAuthor(msg.guild.name, msg.guild.iconURL);
			for (var i = 0; i < thefirst.length; i++) {
				newembed.addField(thefirst[i], thesecond[i]);
			}
			message.edit({
				embed: newembed
			});
		}
	});
	collector.on('end', (collected, reason) => {
		reaction1.remove();
		reaction2.remove();
	});
};
exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'serverwarns',
	description: 'Shows you all given warns on this Discord Server',
	usage: 'serverwarns',
	example: ['serverwarns'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
