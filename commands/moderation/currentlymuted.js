const Discord = require('discord.js');
const ms = require('ms');
exports.run = async (client, msg, args, lang) => {
	const botconfs = client.botconfs.get('botconfs');
	var mutesOfThisServer = [];

	for (var i in botconfs.mutes) {
		if (botconfs.mutes[i].discordserverid === msg.guild.id) {
			mutesOfThisServer.push(botconfs.mutes[i]);
		}
	}

	if (mutesOfThisServer.length === 0) return msg.reply(lang.currentlymuted_error);

	var embed = new Discord.RichEmbed()
		.setAuthor(lang.currentlymuted_embedauthor)
		.setColor('#ff9900')
		.setTimestamp();

	mutesOfThisServer.slice(0, 4).forEach(r => {
		if (!r.moderatorid) {
			r.moderatorid = client.user.id;
		}

		if (!r.reason) {
			r.reason = undefined;
		}

		var embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(r.moderatorid).tag).replace('%muteddate', new Date(r.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(r.muteEndDate - Date.now())).replace('%reason', r.reason);
		embed.addField(client.users.get(r.memberid).tag, embeddescription);
	});

	var message = await msg.channel.send({
		embed: embed
	});

	if (mutesOfThisServer.length > 4) {
		var reaction1 = await message.react('◀');
		var reaction2 = await message.react('▶');

		var first = 0;
		var second = 4;

		var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 200000
		});
		collector.on('collect', r => {
			var reactionadd = mutesOfThisServer.slice(first + 4, second + 4).length;
			var reactionremove = mutesOfThisServer.slice(first - 4, second - 4).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.remove(msg.author.id);

				first = first + 4;
				second = second + 4;

				var newembed = new Discord.RichEmbed()
					.setAuthor(lang.currentlymuted_embedauthor)
					.setColor('#ff9900')
					.setTimestamp();

				mutesOfThisServer.slice(first, second).forEach(r => {
					if (!r.moderatorid) {
						r.moderatorid = client.user.id;
					}

					if (!r.reason) {
						r.reason = undefined;
					}

					var embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(r.moderatorid).tag).replace('%muteddate', new Date(r.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(r.muteEndDate - Date.now())).replace('%reason', r.reason);					newembed.addField(client.users.get(r.memberid).tag, embeddescription);
				});

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.remove(msg.author.id)

				first = first - 4;
				second = second - 4;

				var newembed = new Discord.RichEmbed()
					.setAuthor(lang.currentlymuted_embedauthor)
					.setColor('#ff9900')
					.setTimestamp();

				mutesOfThisServer.slice(first, second).forEach(r => {
					if (!r.moderatorid) {
						r.moderatorid = client.user.id;
					}

					if (!r.reason) {
						r.reason = undefined;
					}

					var embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(r.moderatorid).tag).replace('%muteddate', new Date(r.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(r.muteEndDate - Date.now())).replace('%reason', r.reason);
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
	aliases: ['cm'],
	userpermissions: ['KICK_MEMBERS'],
	dashboardsettings: true
};

exports.help = {
	name: 'currentlymuted',
	description: 'currentlymuted',
	usage: 'currentlymuted',
	example: ['currentlymuted'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
