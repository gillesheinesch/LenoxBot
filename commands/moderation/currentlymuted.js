const Discord = require('discord.js');
const ms = require('ms');
exports.run = async (client, msg, args, lang) => {
	const botconfs = client.botconfs.get('botconfs');
	const mutesOfThisServer = [];

	for (const i in botconfs.mutes) {
		if (botconfs.mutes[i].discordserverid === msg.guild.id) {
			mutesOfThisServer.push(botconfs.mutes[i]);
		}
	}

	if (mutesOfThisServer.length === 0) return msg.reply(lang.currentlymuted_error);

	if (args.slice().length !== 0) {
		let user = msg.mentions.users.first();
		if (!user) {
			try {
				if (!msg.guild.members.get(args.slice().join(' '))) throw new Error('User not found!');
				user = msg.guild.members.get(args.slice().join(' ')).user;
			} catch (error) {
				return msg.reply(lang.ban_idcheck);
			}
		}
		let checkIfMuted = false;
		let muteSettings;
		await mutesOfThisServer.forEach(r => {
			if (r.memberid === user.id) {
				checkIfMuted = true;
				muteSettings = r;
			}
		});

		const notownrole = lang.unmute_notownrole.replace('%username', user.tag);
		if (!checkIfMuted) return msg.reply(notownrole);

		const userembed = new Discord.RichEmbed()
			.setAuthor(lang.currentlymuted_embedauthor)
			.setColor('#ff9900')
			.setTimestamp();

		const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(muteSettings.moderatorid).tag).replace('%muteddate', new Date(muteSettings.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(muteSettings.muteEndDate - Date.now()))
			.replace('%reason', muteSettings.reason);
		userembed.addField(client.users.get(muteSettings.memberid).tag, embeddescription);

		return msg.channel.send({
			embed: userembed
		});
	}

	const embed = new Discord.RichEmbed()
		.setAuthor(lang.currentlymuted_embedauthor)
		.setColor('#ff9900')
		.setTimestamp();

	mutesOfThisServer.slice(0, 4).forEach(rr => {
		if (!rr.moderatorid) {
			rr.moderatorid = client.user.id;
		}

		if (!rr.reason) {
			rr.reason = 'undefined';
		}

		const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(rr.moderatorid).tag).replace('%muteddate', new Date(rr.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(rr.muteEndDate - Date.now()))
			.replace('%reason', rr.reason);
		embed.addField(client.users.get(rr.memberid).tag, embeddescription);
	});

	const message = await msg.channel.send({
		embed: embed
	});

	if (mutesOfThisServer.length > 4) {
		const reaction1 = await message.react('◀');
		const reaction2 = await message.react('▶');

		let first = 0;
		let second = 4;

		const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 200000
		});
		collector.on('collect', r => {
			const reactionadd = mutesOfThisServer.slice(first + 4, second + 4).length;
			const reactionremove = mutesOfThisServer.slice(first - 4, second - 4).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.remove(msg.author.id);

				first += 4;
				second += 4;

				const newembed = new Discord.RichEmbed()
					.setAuthor(lang.currentlymuted_embedauthor)
					.setColor('#ff9900')
					.setTimestamp();

				mutesOfThisServer.slice(first, second).forEach(rrr => {
					if (!rrr.moderatorid) {
						rrr.moderatorid = client.user.id;
					}

					if (!r.reason) {
						rrr.reason = 'undefined';
					}

					const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(rrr.moderatorid).tag).replace('%muteddate', new Date(rrr.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(rrr.muteEndDate - Date.now()))
						.replace('%reason', rrr.reason);
					newembed.addField(client.users.get(rrr.memberid).tag, embeddescription);
				});

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.remove(msg.author.id);

				first -= 4;
				second -= 4;

				const newembed = new Discord.RichEmbed()
					.setAuthor(lang.currentlymuted_embedauthor)
					.setColor('#ff9900')
					.setTimestamp();

				mutesOfThisServer.slice(first, second).forEach(rrr => {
					if (!rrr.moderatorid) {
						rrr.moderatorid = client.user.id;
					}

					if (!r.reason) {
						rrr.reason = 'undefined';
					}

					const embeddescription = lang.currentlymuted_embeddescription.replace('%moderatortag', client.users.get(rrr.moderatorid).tag).replace('%muteddate', new Date(rrr.muteCreatedAt).toUTCString()).replace('%remainingmutetime', ms(rrr.muteEndDate - Date.now()))
						.replace('%reason', rrr.reason);
					newembed.addField(client.users.get(rrr.memberid).tag, embeddescription);
				});

				message.edit({
					embed: newembed
				});
			}
		});
		collector.on('end', () => {
			reaction1.remove();
			reaction2.remove();
		});
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Mute',
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
