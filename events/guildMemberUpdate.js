const Discord = require('discord.js');
exports.run = (client, oldMember, newMember) => {
	const tableload = client.guildconfs.get(newMember.guild.id);
	if (!tableload) return;

	if (tableload.language === '') {
		tableload.language = 'en-US';
		client.guildconfs.set(newMember.guild.id, tableload);
	}

	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en') {
		tableload.language = 'en-US';
		client.guildconfs.set(newMember.guild.id, tableload);
	}

	if (tableload.language === 'ge') {
		tableload.language = 'de-DE';
		client.guildconfs.set(newMember.guild.id, tableload);
	}

	if (tableload.language === 'fr') {
		tableload.language = 'fr-FR';
		client.guildconfs.set(newMember.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM

	const lang = require(`../languages/${tableload.language}.json`);
	if (oldMember.nickname !== newMember.nickname) {
		if (!tableload.nicknamelog) {
			tableload.nicknamelog = [];
			client.guildconfs.set(newMember.guild.id, tableload);
		}

		tableload.nicknamelog.push(newMember.id);
		tableload.nicknamelog.push(oldMember.nickname === null ? lang.guildmemberupdateevent_nonickname : oldMember.nickname);
		tableload.nicknamelog.push(newMember.nickname === null ? lang.guildmemberupdateevent_nonickname : newMember.nickname);
		tableload.nicknamelog.push(new Date().getTime());
		client.guildconfs.set(newMember.id, tableload);
	}

	if (tableload.guildmemberupdatelog === 'false') return;

	const messagechannel = client.channels.get(tableload.guildmemberupdatelogchannel);

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
