const Discord = require('discord.js');
exports.run = async(client, oldGuild, newGuild) => {
	const tableconfig = client.guildconfs.get(oldGuild.id);

	if (!tableconfig.guildupdatelog) {
		tableconfig.guildupdatelog = 'false';
		tableconfig.guildupdatelogchannel = '';
		await client.guildconfs.set(oldGuild.id, tableconfig);
		client.guildconfs.close();
	}
	if (tableconfig.guildupdatelog === 'false') return;
	
	const messagechannel = client.channels.get(tableconfig.guildupdatelogchannel);

	if (oldGuild.name !== newGuild.name) {
		const embed = new Discord.RichEmbed()
		.setColor('#FE2E2E')
		.setTimestamp()
		.setAuthor('Name changed!')
		.addField(`📤 Old Name:`, oldGuild.name)
		.addField(`📥 New Name:`, newGuild.name);
		messagechannel.send({ embed: embed });
	}

		if (oldGuild.afkChannelID !== newGuild.afkChannelID) {
		const embed = new Discord.RichEmbed()
		.setColor('#FE2E2E')
		.setTimestamp()
		.setAuthor('AFK channel changed!')
		.addField(`📤 Old AFK Channel:`, oldGuild.afkChannel == null ? 'There wasn\'t an AFK Channel before' : oldGuild.afkChannel.name)
		.addField(`📥 New AFK Channel:`, newGuild.afkChannel == null ? 'There isn\'t an AFK Channel anymore' : newGuild.afkChannel.name);
		messagechannel.send({ embed: embed });
	}

	if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
		const embed = new Discord.RichEmbed()
		.setColor('#FE2E2E')
		.setTimestamp()
		.setAuthor('AFK timeout changed!')
		.addField(`📤 Old AFK Timeout:`, `${oldGuild.afkTimeout} seconds`)
		.addField(`📥 New AFK Timeout:`, `${newGuild.afkTimeout} seconds`);
		messagechannel.send({ embed: embed });
	}

	if (oldGuild.iconURL !== newGuild.iconURL) {
		const embed = new Discord.RichEmbed()
		.setColor('#FE2E2E')
		.setTimestamp()
		.setAuthor('Servericon changed!')
		.addField(`📤 Old Servericon:`, oldGuild.iconURL == null ? 'There wasn\'t a servericon before' : oldGuild.iconURL)
		.addField(`📥 New Servericon:`, newGuild.iconURL == null ? 'There isn\'t an Servericon anymore' : newGuild.iconURL);
		messagechannel.send({ embed: embed });
	}

	if (oldGuild.owner.id !== newGuild.owner.id) {
		const embed = new Discord.RichEmbed()
		.setColor('#FE2E2E')
		.setTimestamp()
		.setAuthor('Owner changed!')
		.addField(`📤 Old Owner:`, oldGuild.owner.user.tag)
		.addField(`📥 New Owner:`, newGuild.owner.user.tag);
		messagechannel.send({ embed: embed });
	}
};
