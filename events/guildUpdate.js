const Discord = require('discord.js');
module.exports = {
	run: (oldGuild, newGuild) => {
		if (!client.provider.isReady) return;
		if (!client.provider.getGuild(newGuild.id, 'prefix')) return;

		const lang = require(`../languages/${client.provider.getGuild(newGuild.id, 'language')}.json`);

		if (client.provider.getGuild(newGuild.id, 'guildupdatelog') === 'false') return;

		const messagechannel = client.channels.get(client.provider.getGuild(newGuild.id, 'guildupdatelogchannel'));
		if (!messagechannel) return;

		if (oldGuild.name !== newGuild.name) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.guildupdateevent_namechanged)
				.addField(`📤 ${lang.guildupdateevent_oldname}`, oldGuild.name)
				.addField(`📥 ${lang.guildupdateevent_newname}`, newGuild.name);
			messagechannel.send({ embed: embed });
		}

		if (oldGuild.afkChannelID !== newGuild.afkChannelID) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.guildupdateevent_afkchanged)
				.addField(`📤 ${lang.guildupdateevent_oldafk}`, oldGuild.afkChannel === null ? lang.guildupdateevent_noafk : oldGuild.afkChannel.name)
				.addField(`📥 ${lang.guildupdateevent_newafk}`, newGuild.afkChannel === null ? lang.guildupdateevent_noafknow : newGuild.afkChannel.name);
			messagechannel.send({ embed: embed });
		}

		if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.guildupdateevent_afktimeoutchanged)
				.addField(`📤${lang.guildupdateevent_oldafktimeout}`, `${oldGuild.afkTimeout} ${lang.guildupdateevent_seconds}`)
				.addField(`📥 ${lang.guildupdateevent_newafktimeout}`, `${newGuild.afkTimeout} ${lang.guildupdateevent_seconds}`);
			messagechannel.send({ embed: embed });
		}

		if (oldGuild.iconURL() !== newGuild.iconURL()) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.guildupdateevent_servericonchanged)
				.addField(`📤 ${lang.guildupdateevent_oldservericon}`, oldGuild.iconURL() === null ? lang.guildupdateevent_noservericon : oldGuild.iconURL())
				.addField(`📥 ${lang.guildupdateevent_newservericon}`, newGuild.iconURL() === null ? lang.guildupdateevent_noservericonnow : newGuild.iconURL());
			messagechannel.send({ embed: embed });
		}

		if (oldGuild.owner.id !== newGuild.owner.id) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.guildupdateevent_ownerchanged)
				.addField(`📤 ${lang.guildupdateevent_oldowner}`, oldGuild.owner.user.tag)
				.addField(`📥 ${lang.guildupdateevent_newowner}`, newGuild.owner.user.tag);
			messagechannel.send({ embed: embed });
		}
	}
};
