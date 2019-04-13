const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = class muteCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'mute',
			group: 'moderation',
			memberName: 'mute',
			description: 'Mutes a user for a certain time',
			format: 'mute {@User} {time (d, h, m, s)} {reason}',
			aliases: [],
			examples: ['mute @Tester#7362 1d Toxic behaviour'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['KICK_MEMBERS'],
			shortDescription: 'Mute',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');
		const args = msg.content.split(' ').slice(1);

		let user = msg.mentions.users.first();

		let membermention;
		if (user) {
			membermention = await msg.guild.fetchMember(user);
		}

		const muteroleundefined = lang.mute_muteroleundefined.replace('%prefix', prefix);
		if (msg.client.provider.getGuild(msg.message.guild.id, 'muterole') === '') return msg.channel.send(muteroleundefined);

		if (!user) {
			try {
				const fetchedMember = await msg.guild.fetchMember(args.slice(0, 1).join(' '));
				if (!fetchedMember) throw new Error('User not found!');
				user = fetchedMember;
				membermention = fetchedMember;
				user = user.user;
			} catch (error) {
				return msg.reply(lang.mute_idcheck);
			}
		}

		if (!args.slice(1).join(' ')) return msg.channel.send(lang.mute_notime);
		if (!args.slice(2).join(' ')) return msg.channel.send(lang.mute_noinput);

		const rolenotexist = lang.mute_rolenotexist.replace('%prefix', prefix);
		if (!msg.guild.roles.get(msg.client.provider.getGuild(msg.message.guild.id, 'muterole'))) return msg.channel.send(rolenotexist);

		const role = msg.guild.roles.get(msg.client.provider.getGuild(msg.message.guild.id, 'muterole'));

		if (!args.slice(1, 2).join(' ') || args.slice(1, 2).join(' ').length === 0) return msg.channel.send(lang.mute_invalidtimeformat);
		const mutetime = ms(args.slice(1, 2).join(' '));
		if (typeof mutetime === 'undefined') return msg.channel.send(lang.mute_invalidtimeformat);

		const alreadymuted = lang.mute_alreadymuted.replace('%username', user.username);
		if (membermention.roles.has(msg.client.provider.getGuild(msg.message.guild.id, 'muterole'))) return msg.channel.send(alreadymuted);

		membermention.addRole(role);

		const mutedby = lang.mute_mutedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
		const mutedescription = lang.mute_mutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', args.slice(2).join(' '))
			.replace('%mutetime', ms(mutetime));
		const embed = new Discord.RichEmbed()
			.setAuthor(mutedby, msg.author.displayAvatarURL)
			.setThumbnail(user.displayAvatarURL)
			.setColor('#FF0000')
			.setTimestamp()
			.setDescription(mutedescription);

		if (msg.client.provider.getGuild(msg.message.guild.id, 'muteanonymous') === 'true') {
			const anonymousembed = new Discord.RichEmbed()
				.setThumbnail(user.displayAvatarURL)
				.setColor('#FF0000')
				.setTimestamp()
				.setDescription(mutedescription);
			user.send({
				embed: anonymousembed
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

		let currentMutescount = msg.client.provider.getBotsettings('botconfs', 'mutescount');
		currentMutescount += 1;
		await msg.client.provider.setBotsettings('botconfs', 'mutescount', currentMutescount);

		const currentMutescount2 = msg.client.provider.getBotsettings('botconfs', 'mutescount');

		const mutesettings = {
			discordserverid: msg.guild.id,
			memberid: membermention.id,
			moderatorid: msg.author.id,
			reason: args.slice(2).join(' '),
			roleid: role.id,
			mutetime: mutetime,
			muteCreatedAt: Date.now(),
			muteEndDate: Date.now() + mutetime,
			mutescount: currentMutescount2
		};

		const currentMutes = msg.client.provider.getBotsettings('botconfs', 'mutes');
		currentMutes[currentMutescount2] = mutesettings;
		await msg.client.provider.setBotsettings('botconfs', 'mutes', currentMutes);

		const muted = lang.mute_muted.replace('%username', user.username).replace('%mutetime', ms(mutetime));
		const muteembed = new Discord.RichEmbed()
			.setColor('#99ff66')
			.setDescription(`✅ ${muted}`);
		msg.channel.send({
			embed: muteembed
		});

		setTimeout(async () => {
			if (msg.client.provider.getGuild(msg.message.guild.id, 'muterole') !== '' && membermention.roles.has(msg.client.provider.getGuild(msg.message.guild.id, 'muterole'))) {
				await membermention.removeRole(role);

				const unmutedby = lang.unmute_unmutedby.replace('%authortag', `${msg.client.user.tag}`);
				const automaticunmutedescription = lang.unmute_automaticunmutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
				const unmutedembed = new Discord.RichEmbed()
					.setAuthor(unmutedby, msg.client.user.displayAvatarURL)
					.setThumbnail(user.displayAvatarURL)
					.setColor('#FF0000')
					.setTimestamp()
					.setDescription(automaticunmutedescription);

				if (msg.client.provider.getGuild(msg.message.guild.id, 'modlog') === 'true') {
					const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.message.guild.id, 'modlogchannel'));
					modlogchannel.send({ embed: unmutedembed });
				}
			}
			const newCurrentMutes = msg.client.provider.getBotsettings('botconfs', 'mutes');
			delete newCurrentMutes[currentMutescount2];
			await msg.client.provider.setBotsettings('botconfs', 'mutes', newCurrentMutes);
		}, mutetime);
	}
};
