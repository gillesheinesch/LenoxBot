const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = class currentlybannedCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'currentlybanned',
			group: 'moderation',
			memberName: 'currentlybanned',
			description: 'currentlybanned',
			format: 'currentlybanned [@USER/UserID]',
			aliases: ['cb'],
			examples: ['currentlybanned', 'currentlybanned @Monkeyyy11#0001', 'currentlybanned 353115097318555649'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['KICK_MEMBERS'],
			shortDescription: 'Ban',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const bansOfThisServer = [];
		const fetchedBans = await msg.guild.fetchBans();
		let fetchedUser;

		for (const i in msg.client.provider.getBotsettings('botconfs', 'bans')) {
			if (msg.client.provider.getBotsettings('botconfs', 'bans')[i].discordserverid === msg.guild.id) {
				bansOfThisServer.push(msg.client.provider.getBotsettings('botconfs', 'bans')[i]);
			}
		}

		if (bansOfThisServer.length === 0) return msg.reply(lang.currentlybanned_error);

		if (args.slice().length !== 0) {
			fetchedUser = msg.mentions.users.first();
			if (!fetchedUser) {
				try {
					if (!fetchedBans.get(args.slice().join(' '))) throw new Error('User not found!');
					fetchedUser = fetchedBans.get(args.slice().join(' '));
				} catch (error) {
					return msg.reply(lang.ban_idcheck);
				}
			}
			let checkIfBanned = false;
			let banSettings;
			await bansOfThisServer.forEach(r => {
				if (r.memberid === fetchedUser.id) {
					checkIfBanned = true;
					banSettings = r;
				}
			});

			if (!checkIfBanned) return msg.reply(lang.unban_notbanned);

			const userembed = new Discord.RichEmbed()
				.setAuthor(lang.currentlybanned_embedauthor)
				.setColor('#ff9900')
				.setTimestamp();

			const embeddescription = lang.currentlybanned_embeddescription.replace('%moderatortag', msg.client.users.get(banSettings.moderatorid).tag).replace('%banneddate', new Date(banSettings.banCreatedAt).toUTCString()).replace('%remainingbantime', ms(banSettings.banEndDate - Date.now()))
				.replace('%reason', banSettings.reason);
			userembed.addField(`${fetchedUser.username}#${fetchedUser.discriminator}`, embeddescription);

			return msg.channel.send({
				embed: userembed
			});
		}

		const embed = new Discord.RichEmbed()
			.setAuthor(lang.currentlybanned_embedauthor)
			.setColor('#ff3300')
			.setTimestamp();

		bansOfThisServer.slice(0, 4).forEach(r => {
			if (fetchedBans.get(r.memberid)) {
				if (!r.moderatorid) {
					r.moderatorid = msg.client.user.id;
				}

				if (!r.reason) {
					r.reason = 'undefined';
				}

				fetchedUser = fetchedBans.get(r.memberid);

				const embeddescription = lang.currentlybanned_embeddescription.replace('%moderatortag', msg.client.users.get(r.moderatorid).tag).replace('%banneddate', new Date(r.banCreatedAt).toUTCString()).replace('%remainingbantime', ms(r.banEndDate - Date.now()))
					.replace('%reason', r.reason);
				embed.addField(`${fetchedUser.username}#${fetchedUser.discriminator}`, embeddescription);
			}
		});

		const message = await msg.channel.send({
			embed: embed
		});

		if (bansOfThisServer.length > 4) {
			const reaction1 = await message.react('◀');
			const reaction2 = await message.react('▶');

			let first = 0;
			let second = 4;

			const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
				time: 200000
			});
			collector.on('collect', r => {
				const reactionadd = bansOfThisServer.slice(first + 4, second + 4).length;
				const reactionremove = bansOfThisServer.slice(first - 4, second - 4).length;

				if (r.emoji.name === '▶' && reactionadd !== 0) {
					r.remove(msg.author.id);

					first += 4;
					second += 4;

					const newembed = new Discord.RichEmbed()
						.setAuthor(lang.currentlybanned_embedauthor)
						.setColor('#ff3300')
						.setTimestamp();

					bansOfThisServer.slice(first, second).forEach(rr => {
						if (!rr.moderatorid) {
							rr.moderatorid = msg.client.user.id;
						}

						if (!rr.reason) {
							rr.reason = 'undefined';
						}

						const embeddescription = lang.currentlybanned_embeddescription.replace('%moderatortag', msg.client.users.get(rr.moderatorid).tag).replace('%banneddate', new Date(rr.banCreatedAt).toUTCString()).replace('%remainingbantime', ms(rr.banEndDate - Date.now()))
							.replace('%reason', rr.reason);
						newembed.addField(msg.client.users.get(rr.memberid).tag, embeddescription);
					});

					message.edit({
						embed: newembed
					});
				} else if (r.emoji.name === '◀' && reactionremove !== 0) {
					r.remove(msg.author.id);

					first -= 4;
					second -= 4;

					const newembed = new Discord.RichEmbed()
						.setAuthor(lang.currentlybanned_embedauthor)
						.setColor('#ff3300')
						.setTimestamp();

					bansOfThisServer.slice(first, second).forEach(rr => {
						if (!rr.moderatorid) {
							rr.moderatorid = msg.client.user.id;
						}

						if (!rr.reason) {
							rr.reason = 'undefined';
						}

						const embeddescription = lang.currentlybanned_embeddescription.replace('%moderatortag', msg.client.users.get(rr.moderatorid).tag).replace('%banneddate', new Date(rr.banCreatedAt).toUTCString()).replace('%remainingbantime', ms(rr.banEndDate - Date.now()))
							.replace('%reason', rr.reason);
						newembed.addField(msg.client.users.get(rr.memberid).tag, embeddescription);
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
	}
};
