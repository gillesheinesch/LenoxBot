const Discord = require('discord.js');
exports.run = (client, role) => {
	const tableload = client.guildconfs.get(role.guild.id);
	if (!tableload) return;

	for (let i = 0; i < tableload.selfassignableroles.length; i++) {
		if (role.id === tableload.selfassignableroles[i]) {
			tableload.selfassignableroles.splice(i, 1);
			return client.guildconfs.set(role.guild.id, tableload);
		}
	}
	if (role.name === 'LenoxBot') return;
	if (tableload.roledeletelog === 'false') return;

	if (tableload.language === '') {
		tableload.language = 'en-US';
		client.guildconfs.set(role.guild.id, tableload);
	}

	// CHANGE TO THE NEW CROWDIN SYSTEM
	if (tableload.language === 'en') {
		tableload.language = 'en-US';
		client.guildconfs.set(role.guild.id, tableload);
	}

	if (tableload.language === 'ge') {
		tableload.language = 'de-DE';
		client.guildconfs.set(role.guild.id, tableload);
	}

	if (tableload.language === 'fr') {
		tableload.language = 'fr-FR';
		client.guildconfs.set(role.guild.id, tableload);
	}
	// CHANGE TO THE NEW CROWDIN SYSTEM

	const lang = require(`../languages/${tableload.language}.json`);

	const messagechannel = client.channels.get(tableload.roledeletelogchannel);
	if (!messagechannel) return;

	const embed = new Discord.RichEmbed()
		.setColor('RED')
		.setTimestamp()
		.setAuthor(lang.roledeleteevent_deleted)
		.addField(`📎 ${lang.rolecreateevent_id}:`, role.id)
		.addField(`🔰 ${lang.rolecreateevent_color}:`, role.hexColor)
		.addField(`📝 ${lang.rolecreateevent_name}:`, role.name);
	messagechannel.send({ embed: embed });
};
