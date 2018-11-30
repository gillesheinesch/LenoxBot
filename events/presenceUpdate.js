const Discord = require('discord.js');
exports.run = (client, oldMember, newMember) => {
	const tableload = client.guildconfs.get(newMember.guild.id);
	if (!tableload) return;

	if (tableload.presenceupdatelog === 'false') return;

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

	const messagechannel = client.channels.get(tableload.presenceupdatelogchannel);
	if (!messagechannel) return;

	if (oldMember.presence.status !== newMember.presence.status) {
		const embed = new Discord.RichEmbed()
			.setColor('ORANGE')
			.setTimestamp()
			.setAuthor(lang.presenceupdateevent_changed)
			.addField(`📎 ${lang.presenceupdateevent_member}:`, `${oldMember.user.tag} (${oldMember.id})`)
			.addField(`📤 ${lang.presenceupdateevent_old}:`, oldMember.presence.status)
			.addField(`📥 ${lang.presenceupdateevent_new}:`, newMember.presence.status);
		messagechannel.send({ embed: embed });
	}
};
