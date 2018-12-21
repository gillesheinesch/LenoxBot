const Discord = require('discord.js');
exports.run = async (client, member) => {
	const tableload = client.guildconfs.get(member.guild.id);
	const botconfs = client.botconfs.get('botconfs');
	if (!tableload) return;

	if (tableload.language === '') {
		tableload.language = 'en-US';
		client.guildconfs.set(member.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en') {
		tableload.language = 'en-US';
		client.guildconfs.set(member.guild.id, tableload);
	}

	if (tableload.language === 'ge') {
		tableload.language = 'de-DE';
		client.guildconfs.set(member.guild.id, tableload);
	}

	if (tableload.language === 'fr') {
		tableload.language = 'fr-FR';
		client.guildconfs.set(member.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM

	const lang = require(`../languages/${tableload.language}.json`);

	let muteOfThisUser;
	for (const i in botconfs.mutes) {
		if (botconfs.mutes[i].discordserverid === member.guild.id && botconfs.mutes[i].memberid === member.id) {
			muteOfThisUser = botconfs.mutes[i];
		}
	}

	if (muteOfThisUser) {
		if ((muteOfThisUser.muteEndDate - Date.now()) > 0) {
			if (member.guild.roles.get(muteOfThisUser.roleid)) {
				const mutedRole = member.guild.roles.get(muteOfThisUser.roleid);
				await member.addRole(mutedRole);
			}
		} else {
			delete botconfs.mutes[muteOfThisUser.mutescount];
			client.botconfs.set('botconfs', botconfs);
		}
	}

	// Joinroles that a guildMember will get when it joins the discord server
	const rolesGiven = [];
	const rolesNotGiven = [];
	if (tableload.joinroles && tableload.joinroles.length !== 0) {
		for (let i = 0; i < tableload.joinroles.length; i++) {
			if (!member.guild.roles.get(tableload.joinroles[i])) {
				const indexOfTheRole = tableload.joinroles.indexOf(tableload.joinroles[i]);
				tableload.joinroles.splice(indexOfTheRole, 1);
				client.guildconfs.set(member.guild.id, tableload);
			}

			if (tableload.joinroles.length !== 0) {
				const roleToAssign = member.guild.roles.get(tableload.joinroles[i]);
				try {
					await member.addRole(roleToAssign);
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
	if (tableload.welcomelog === 'true') {
		const messagechannel = client.channels.get(tableload.welcomelogchannel);
		const embed = new Discord.RichEmbed()
			.setFooter(lang.guildmemberaddevent_userjoined)
			.setTimestamp()
			.setColor('GREEN')
			.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL);
		messagechannel.send({
			embed: embed
		});
	}

	let embed = false;
	if (tableload.welcome === 'true') {
		if (tableload.welcomemsg.length < 1) return;
		const messagechannel = client.channels.get(tableload.welcomechannel);
		if (tableload.welcomemsg.toLowerCase().includes('$embed$')) {
			embed = true;
		}
		const newMessage = tableload.welcomemsg.replace('$username$', member.user.username)
			.replace('$usermention$', member.user)
			.replace('$usertag$', member.user.tag)
			.replace('$userid$', member.user.id)
			.replace('$guildname$', member.guild.name)
			.replace('$guildid$', member.guild.id)
			.replace('$embed$', '');

		if (embed) {
			const welcomeEmbed = new Discord.RichEmbed()
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
};
