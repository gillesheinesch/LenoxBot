const Discord = require('discord.js');
exports.run = (client, member) => {
	if (client.user.id === member.id) return;

	const tableload = client.guildconfs.get(member.guild.id);
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

	if (tableload.byelog === 'true') {
		const messagechannel = client.channels.get(tableload.byelogchannel);
		const embed = new Discord.RichEmbed()
			.setFooter(lang.guildmemberremoveevent_userleft)
			.setTimestamp()
			.setColor('#FF0000')
			.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL);
		messagechannel.send({ embed: embed });
	}

	if (tableload.bye === 'true') {
		if (tableload.byemsg.length < 1) return;
		const message = tableload.byemsg;
		const msgchannel = client.channels.get(tableload.byechannel);
		const newMessage = message.replace('$username$', member.user.username)
			.replace('$usertag$', member.user.tag)
			.replace('$userid$', member.user.id)
			.replace('$guildname$', member.guild.name)
			.replace('$guildid$', member.guild.id);
		msgchannel.send(newMessage);
	}
};
