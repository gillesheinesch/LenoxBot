const Discord = require('discord.js');
const ms = require('ms');
exports.run = async (client, msg, args, lang) => {
	const botconfs = client.botconfs.get('botconfs');
	var bansOfThisServer = [];

	for (var i in botconfs.bans) {
		if (botconfs.bans[i].discordserverid === msg.guild.id) {
			bansOfThisServer.push(botconfs.bans[i]);
		}
	}

	if (bansOfThisServer.length === 0) return msg.reply(lang.currentlybanned_error);

	var embed = new Discord.RichEmbed()
		.setAuthor(lang.currentlybanned_embedauthor)
		.setColor('#ff3300')
		.setTimestamp();

	bansOfThisServer.slice(0, 4).forEach(r => {
		if (!r.moderatorid) {
			r.moderatorid = client.user.id;
		}

		if (!r.reason) {
			r.reason = undefined;
		}

		var embeddescription = lang.currentlybanned_embeddescription.replace('%moderatortag', client.users.get(r.moderatorid).tag).replace('%banneddate', new Date(r.banCreatedAt).toUTCString()).replace('%remainingbantime', ms(r.banEndDate - Date.now())).replace('%reason', r.reason);
		embed.addField(client.users.get(r.memberid).tag, embeddescription);
	});

	var message = await msg.channel.send({
		embed: embed
	});

	if (bansOfThisServer.length > 4) {
		var reaction1 = await message.react('◀');
		var reaction2 = await message.react('▶');

		var first = 0;
		var second = 4;

		var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 200000
		});
		collector.on('collect', r => {
			var reactionadd = bansOfThisServer.slice(first + 4, second + 4).length;
			var reactionremove = bansOfThisServer.slice(first - 4, second - 4).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.remove(msg.author.id);

				first = first + 4;
				second = second + 4;

				var newembed = new Discord.RichEmbed()
					.setAuthor(lang.currentlybanned_embedauthor)
					.setColor('#ff3300')
					.setTimestamp();

				bansOfThisServer.slice(first, second).forEach(r => {
					if (!r.moderatorid) {
						r.moderatorid = client.user.id;
					}

					if (!r.reason) {
						r.reason = undefined;
					}

					var embeddescription = lang.currentlybanned_embeddescription.replace('%moderatortag', client.users.get(r.moderatorid).tag).replace('%banneddate', new Date(r.banCreatedAt).toUTCString()).replace('%remainingbantime', ms(r.banEndDate - Date.now())).replace('%reason', r.reason);
					newembed.addField(client.users.get(r.memberid).tag, embeddescription);
				});

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.remove(msg.author.id)

				first = first - 4;
				second = second - 4;

				var newembed = new Discord.RichEmbed()
					.setAuthor(lang.currentlybanned_embedauthor)
					.setColor('#ff3300')
					.setTimestamp();

				bansOfThisServer.slice(first, second).forEach(r => {
					if (!r.moderatorid) {
						r.moderatorid = client.user.id;
					}

					if (!r.reason) {
						r.reason = undefined;
					}

					var embeddescription = lang.currentlybanned_embeddescription.replace('%moderatortag', client.users.get(r.moderatorid).tag).replace('%banneddate', new Date(r.banCreatedAt).toUTCString()).replace('%remainingbantime', ms(r.banEndDate - Date.now())).replace('%reason', r.reason);
					newembed.addField(client.users.get(r.memberid).tag, embeddescription);
				});

				message.edit({
					embed: newembed
				});
			}
		});
		collector.on('end', (collected, reason) => {
			reaction1.remove();
			reaction2.remove();
		});
	} else {
		return undefined;
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['cb'],
	userpermissions: ['KICK_MEMBERS'],
	dashboardsettings: true
};

exports.help = {
	name: 'currentlybanned',
	description: 'currentlybanned',
	usage: 'currentlybanned',
	example: ['currentlybanned'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};