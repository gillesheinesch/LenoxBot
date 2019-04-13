const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class unmuteCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'unmute',
			group: 'moderation',
			memberName: 'unmute',
			description: 'Unmutes a user',
			format: 'unmute {@User} {reason}',
			aliases: ['um'],
			examples: ['unmute @Tester#7352 Wrong mute'],
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

		const muteroleundefined = lang.unmute_muteroleundefined.replace('%prefix', prefix);
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

		if (!args.slice(1).join(' ')) return msg.channel.send(lang.unmute_noinput);

		const rolenotexist = lang.unmute_rolenotexist.replace('%prefix', prefix);
		if (!msg.guild.roles.get(msg.client.provider.getGuild(msg.message.guild.id, 'muterole'))) return msg.channel.send(rolenotexist);

		const role = msg.guild.roles.get(msg.client.provider.getGuild(msg.message.guild.id, 'muterole'));

		if (membermention.roles.has(msg.client.provider.getGuild(msg.message.guild.id, 'muterole'))) {
			await membermention.removeRole(role);

			const unmutedby = lang.unmute_unmutedby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
			const unmutedescription = lang.unmute_unmutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', args.slice(1).join(' '));
			const embed = new Discord.RichEmbed()
				.setAuthor(unmutedby, msg.author.displayAvatarURL)
				.setThumbnail(user.displayAvatarURL)
				.setColor('#FF0000')
				.setTimestamp()
				.setDescription(unmutedescription);

			if (msg.client.provider.getGuild(msg.message.guild.id, 'muteanonymous') === 'true') {
				const anonymousembed = new Discord.RichEmbed()
					.setThumbnail(user.displayAvatarURL)
					.setColor('#FF0000')
					.setTimestamp()
					.setDescription(unmutedescription);
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

			const unmuted = lang.unmute_unmuted.replace('%username', user.username);
			const unmuteembed = new Discord.RichEmbed()
				.setColor('#99ff66')
				.setDescription(`✅ ${unmuted}`);
			msg.channel.send({
				embed: unmuteembed
			});

			let muteOfThisUser;
			for (const i in msg.client.provider.getBotsettings('botconfs', 'mutes')) {
				if (msg.client.provider.getBotsettings('botconfs', 'mutes')[i].discordserverid === membermention.guild.id && msg.client.provider.getBotsettings('botconfs', 'mutes')[i].memberid === membermention.id) {
					muteOfThisUser = msg.client.provider.getBotsettings('botconfs', 'mutes')[i];
					const currentMutes = msg.client.provider.getBotsettings('botconfs', 'mutes');
					delete currentMutes[muteOfThisUser.mutescount];
					await msg.client.provider.setBotsettings('botconfs', 'mutes', currentMutes);
				}
			}
		} else {
			const notownrole = lang.unmute_notownrole.replace('%username', user.username);
			msg.reply(notownrole);
		}
	}
};
