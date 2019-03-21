const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = class temporarybanCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'temporaryban',
			group: 'moderation',
			memberName: 'temporaryban',
			description: 'Ban an user temporary',
			format: 'temporaryban {@User/UserID} {time (d, h, m, s)} {reason}',
			aliases: ['tempban'],
			examples: ['temporaryban @Monkeyyy11#0001 1d Toxic behaviour'],
			clientpermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
			userpermissions: ['BAN_MEMBERS'],
			shortDescription: 'Ban',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		const reason = args.slice(2).join(' ');
		const time = args.slice(1, 2).join(' ');
		let user = msg.mentions.users.first();

		let membermention;
		if (user) {
			membermention = await msg.guild.fetchMember(user);
		}

		if (!user) {
			try {
				const fetchedMember = await msg.guild.fetchMember(args.slice(0, 1).join(' '));
				if (!fetchedMember) throw new Error('User not found!');
				user = fetchedMember;
				user = user.user;
			} catch (error) {
				return msg.reply(lang.ban_idcheck);
			}
		}

		if (user === msg.author) return msg.channel.send(lang.ban_yourself);
		if (!time) return msg.reply('No time given');
		if (!reason) return msg.reply(lang.ban_noinput);


		if (!membermention.bannable) return msg.reply(lang.ban_nopermission);
		await membermention.ban(user);

		const bantime = ms(args.slice(1, 2).join(' '));
		if (typeof bantime === 'undefined') return msg.channel.send(lang.temporaryban_invalidtimeformat);

		const banned = lang.temporaryban_banned.replace('%usertag', user.tag).replace('%bantime', ms(bantime));
		const banembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${banned}`);
		msg.channel.send({
			embed: banembed
		});

		const bandescription = lang.temporaryban_bandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason)
			.replace('%bantime', ms(bantime));
		const embed = new Discord.RichEmbed()
			.setAuthor(`${lang.temporaryban_bannedby} ${msg.author.username}${msg.author.discriminator}`, msg.author.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(bandescription);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'tempbananonymous') === 'true') {
			const ananonymousembed = new Discord.RichEmbed()
				.setThumbnail(user.displayAvatarURL)
				.setColor('#FF0000')
				.setTimestamp()
				.setDescription(bandescription);

			user.send({
				embed: ananonymousembed
			});
		} else {
			user.send({
				embed: embed
			});
		}

		if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
			const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel'));
			modlogchannel.send({ embed: embed });
		}

		let currentBanscount = msg.client.provider.getBotsettings('botconfs', 'banscount');
		currentBanscount += 1;
		await msg.client.provider.setBotsettings('botconfs', 'banscount', currentBanscount);

		const bansettings = {
			discordserverid: msg.guild.id,
			memberid: membermention.id,
			moderatorid: msg.author.id,
			reason: reason,
			bantime: bantime,
			banCreatedAt: Date.now(),
			banEndDate: Date.now() + bantime,
			banscount: msg.client.provider.getBotsettings('botconfs', 'banscount')
		};

		const currentBans = msg.client.provider.getBotsettings('botconfs', 'bans');
		currentBans[msg.client.provider.getBotsettings('botconfs', 'banscount')] = bansettings;
		await msg.client.provider.setBotsettings('botconfs', 'bans', currentBans);

		setTimeout(async () => {
			const fetchedbans = await msg.guild.fetchBans();
			if (fetchedbans.has(user.id)) {
				await msg.guild.unban(user);

				const unbannedby = lang.unban_unbannedby.replace('%authortag', `${msg.client.user.tag}`);
				const automaticbandescription = lang.temporaryban_automaticbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
				const unmutedembed = new Discord.RichEmbed()
					.setAuthor(unbannedby, msg.client.user.displayAvatarURL)
					.setThumbnail(user.displayAvatarURL)
					.setColor('#FF0000')
					.setTimestamp()
					.setDescription(automaticbandescription);

				if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
					const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel'));
					modlogchannel.send({ embed: unmutedembed });
				}
			}

			const newCurrentBans = msg.client.provider.getBotsettings('botconfs', 'bans');
			delete newCurrentBans[msg.client.provider.getBotsettings('botconfs', 'banscount')];
			await msg.client.provider.setBotsettings('botconfs', 'bans', newCurrentBans);
		}, bantime);
	}
};
