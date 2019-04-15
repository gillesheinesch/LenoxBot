const Discord = require('discord.js');
exports.run = async (client, oldMember, newMember) => {
	if (!client.provider.isReady) return;
	if (!client.provider.getGuild(newMember.guild.id, 'prefix')) return;

	const lang = require(`../languages/${client.provider.getGuild(newMember.guild.id, 'language')}.json`);
	if (oldMember.nickname !== newMember.nickname) {
		const currentNicknamelog = client.provider.getGuild(newMember.guild.id, 'nicknamelog');
		currentNicknamelog.push(newMember.id);
		currentNicknamelog.push(oldMember.nickname === null ? lang.guildmemberupdateevent_nonickname : oldMember.nickname);
		currentNicknamelog.push(newMember.nickname === null ? lang.guildmemberupdateevent_nonickname : newMember.nickname);
		currentNicknamelog.push(new Date().getTime());
		await client.provider.setGuild(newMember.guild.id, 'nicknamelog', currentNicknamelog);
	}

	// SEND SINGLE MESSAGE
	const user = { id: newMember.user.id, username: newMember.user.username, discriminator: newMember.user.discriminator, avatar: newMember.user.avatar };
	const singleMessage = { type: 'single', data: user };
	process.send(singleMessage);

	if (client.provider.getGuild(newMember.guild.id, 'guildmemberupdatelog') === 'false') return;

	const messagechannel = client.channels.get(client.provider.getGuild(newMember.guild.id, 'guildmemberupdatelogchannel'));

	if (oldMember.nickname !== newMember.nickname) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.guildmemberupdateevent_nicknamechanged)
			.addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`)
			.addField(`📤${lang.guildmemberupdateevent_oldnickname}`, oldMember.nickname === null ? lang.guildmemberupdateevent_membernonickname : oldMember.nickname)
			.addField(`📥 ${lang.guildmemberupdateevent_newnickname}`, newMember.nickname === null ? lang.guildmemberupdateevent_nicknamereset : newMember.nickname);
		messagechannel.send({
			embed: embed
		});
	}


	if (oldMember.roles.size < newMember.roles.size) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.guildmemberupdateevent_roleassigned)
			.addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`);
		for (const role of newMember.roles.map(x => x.id)) {
			if (!oldMember.roles.has(role)) {
				embed.addField(`📥 ${lang.guildmemberupdateevent_role}`, `${oldMember.guild.roles.get(role).name}`);
			}
		}
		messagechannel.send({
			embed
		});
	}

	if (oldMember.roles.size > newMember.roles.size) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.guildmemberupdateevent_roleremoved)
			.addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`);
		for (const role of oldMember.roles.map(x => x.id)) {
			if (!newMember.roles.has(role)) {
				embed.addField(`📥 ${lang.guildmemberupdateevent_role}`, `${oldMember.guild.roles.get(role).name}`);
			}
		}
		messagechannel.send({
			embed
		});
	}
};
