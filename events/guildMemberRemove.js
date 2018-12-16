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
			.setColor('RED')
			.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL);
		messagechannel.send({
			embed: embed
		});
	}

	let embed = false;
	if (tableload.bye === 'true') {
		if (tableload.byemsg.length < 1) return;
		const messagechannel = client.channels.get(tableload.byechannel);
		if (tableload.byemsg.toLowerCase().includes('$embed$')) {
			embed = true;
		}
		const newMessage = tableload.byemsg.replace('$username$', member.user.username)
			.replace('$usertag$', member.user.tag)
			.replace('$userid$', member.user.id)
			.replace('$guildname$', member.guild.name)
			.replace('$guildid$', member.guild.id)
			.replace('$embed$', '');

		if (embed) {
			const byeEmbed = new Discord.RichEmbed()
				.setTimestamp()
				.setDescription(newMessage)
				.setColor('RED');
			messagechannel.send({
				embed: byeEmbed
			});
		} else {
			messagechannel.send(newMessage);
		}
	}
};
