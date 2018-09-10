const Discord = require('discord.js');
exports.run = async (client, role) => {
	const tableload = await client.guildconfs.get(role.guild.id);
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
		tableload.language = 'en';
		client.guildconfs.set(role.guild.id, tableload);
	}

	const lang = require(`../languages/${tableload.language}.json`);

	const messagechannel = client.channels.get(tableload.roledeletelogchannel);

	const embed = new Discord.RichEmbed()
		.setColor('#FE2E2E')
		.setTimestamp()
		.setAuthor(lang.roledeleteevent_deleted)
		.addField(`📎 ${lang.rolecreateevent_id}:`, role.id)
		.addField(`🔰 ${lang.rolecreateevent_color}:`, role.hexColor)
		.addField(`📝 ${lang.rolecreateevent_name}:`, role.name);
	messagechannel.send({ embed: embed });
};
