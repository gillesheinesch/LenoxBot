const Discord = require('discord.js');
module.exports = {
	run: async member => {
		if (!client.provider.isReady) return;
		if (!client.provider.getGuild(member.guild.id, 'prefix')) return;

		const lang = require(`../languages/${client.provider.getGuild(member.guild.id, 'language')}.json`);

		let muteOfThisUser;
		for (const i in client.provider.getBotsettings('botconfs', 'mutes')) {
			if (client.provider.getBotsettings('botconfs', 'mutes')[i].discordserverid === member.guild.id && client.provider.getBotsettings('botconfs', 'mutes')[i].memberid === member.id) {
				muteOfThisUser = client.provider.getBotsettings('botconfs', 'mutes')[i];
			}
		}

		if (muteOfThisUser) {
			if ((muteOfThisUser.muteEndDate - Date.now()) > 0) {
				if (member.guild.roles.get(muteOfThisUser.roleid)) {
					const mutedRole = member.guild.roles.get(muteOfThisUser.roleid);
					await member.roles.add(mutedRole);
				}
			} else {
				const currentMutes = client.provider.getBotsettings('botconfs', 'mutes');
				delete currentMutes[muteOfThisUser.mutescount];
				await client.provider.setBotsettings('botconfs', 'mutes', currentMutes);
			}
		}

		// Joinroles that a guildMember will get when it joins the discord server
		const rolesGiven = [];
		const rolesNotGiven = [];
		if (client.provider.getGuild(member.guild.id, 'joinroles') && client.provider.getGuild(member.guild.id, 'joinroles').length !== 0) {
			for (let i = 0; i < client.provider.getGuild(member.guild.id, 'joinroles').length; i += 1) {
				if (!member.guild.roles.get(client.provider.getGuild(member.guild.id, 'joinroles')[i])) {
					const indexOfTheRole = client.provider.getGuild(member.guild.id, 'joinroles').indexOf(client.provider.getGuild(member.guild.id, 'joinroles')[i]);
					const currentJoinroles = client.provider.getGuild(member.guild.id, 'joinroles');
					currentJoinroles.splice(indexOfTheRole, 1);
					await client.provider.setGuild(member.guild.id, 'joinroles', currentJoinroles);
				}

				if (client.provider.getGuild(member.guild.id, 'joinroles').length !== 0) {
					const roleToAssign = member.guild.roles.get(client.provider.getGuild(member.guild.id, 'joinroles')[i]);
					try {
						await member.roles.add(roleToAssign);
						rolesGiven.push(roleToAssign.name);
					} catch (error) {
						rolesNotGiven.push(roleToAssign.name);
					}
				}
			}
			if (rolesNotGiven.length !== 0) {
				const joinrolesnotgiven = lang.guildmemberaddevent_joinrolesnotgiven.replace('%roles', rolesNotGiven.join(', '));
				member.send(joinrolesnotgiven);
			}
		}

		// Logs:
		if (client.provider.getGuild(member.guild.id, 'welcomelog') === 'true') {
			const messagechannel = client.channels.get(client.provider.getGuild(member.guild.id, 'welcomelogchannel'));
			const embed = new Discord.MessageEmbed()
				.setFooter(lang.guildmemberaddevent_userjoined)
				.setTimestamp()
				.setColor('GREEN')
				.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL());
			messagechannel.send({
				embed: embed
			});
		}

		let embed = false;
		if (client.provider.getGuild(member.guild.id, 'welcome') === 'true') {
			if (client.provider.getGuild(member.guild.id, 'welcomemsg').length < 1) return;
			const messagechannel = client.channels.get(client.provider.getGuild(member.guild.id, 'welcomechannel'));
			if (client.provider.getGuild(member.guild.id, 'welcomemsg').toLowerCase().includes('$embed$')) {
				embed = true;
			}
			const newMessage = client.provider.getGuild(member.guild.id, 'welcomemsg').replace('$username$', member.user.username)
				.replace('$usermention$', member.user)
				.replace('$usertag$', member.user.tag)
				.replace('$userid$', member.user.id)
				.replace('$guildname$', member.guild.name)
				.replace('$guildid$', member.guild.id)
				.replace('$embed$', '');

			if (embed) {
				const welcomeEmbed = new Discord.MessageEmbed()
					.setTimestamp()
					.setDescription(newMessage)
					.setColor('GREEN');
				messagechannel.send({
					embed: welcomeEmbed
				});
			} else {
				messagechannel.send(newMessage);
			}
		}
	}
};
