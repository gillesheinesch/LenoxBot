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

	if (args.slice().length !== 0) {
		var user = msg.mentions.users.first();
		if (!user) {
			try {
				if (!msg.guild.members.get(args.slice().join(" "))) throw 'Usernotfound';
				user = msg.guild.members.get(args.slice().join(" ")).user;
			} catch (error) {
				return msg.reply(lang.ban_idcheck);
			}
		}
		var checkIfMuted = false;
		var muteSettings;
		await mutesOfThisServer.forEach(r => {
			if (r.memberid === user.id) {
				checkIfMuted = true;
				muteSettings = r;
			}
		});

		var notownrole = lang.unmute_notownrole.replace('%username', user.tag);
		if (!checkIfMuted) return msg.reply(notownrole);

		var userembed = new Discord.RichEmbed()
		.setAuthor(lang.currentlymuted_embedauthor)
		.setColor('#ff9900')
		.setTimestamp();

		var embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(muteSettings.moderatorid).tag).replace('%muteddate', new Date(muteSettings.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(muteSettings.muteEndDate - Date.now())).replace('%reason', muteSettings.reason);
		userembed.addField(client.users.get(muteSettings.memberid).tag, embeddescription);

		return msg.channel.send({
			embed: userembed
		});
	}

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

					var embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(r.moderatorid).tag).replace('%muteddate', new Date(r.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(r.muteEndDate - Date.now())).replace('%reason', r.reason);
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
	shortDescription: "Mute",
	aliases: ['cm'],
	userpermissions: ['KICK_MEMBERS'],
	dashboardsettings: true
};

exports.help = {
	name: 'currentlymuted',
	description: 'currentlymuted',
	usage: 'currentlymuted [@USER/UserID]',
	example: ['currentlymuted', 'currentlymuted @Monkeyyy11#0001', 'currentlymuted 353115097318555649'],
	category: 'moderation',
	botpermissions: ['SEND_MESSAGES']
};
