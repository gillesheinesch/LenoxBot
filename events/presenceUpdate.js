const Discord = require('discord.js');
// exports.run = (client, oldPresence, newPresence) => {
module.exports = {
	run: (oldPresence, newPresence) => {
		/* try {
			if (!client.provider.isReady); // return
			if (!client.provider.getGuild(newPresence.guild.id, 'prefix')) return;

			if (client.provider.getGuild(newPresence.guild.id, 'presenceupdatelog') === 'false') return;

			const lang = require(`../languages/${client.provider.getGuild(newPresence.guild.id, 'language')}.json`);

			const messagechannel = client.channels.get(client.provider.getGuild(newPresence.guild.id, 'presenceupdatelogchannel'));
			if (!messagechannel) return;

			if (oldPresence.status !== newPresence.status) {
				const embed = new Discord.MessageEmbed()
					.setColor('ORANGE')
					.setTimestamp()
					.setAuthor(lang.presenceupdateevent_changed)
					.addField(`📎 ${lang.presenceupdateevent_member}:`, `${newPresence.user.tag} (${newPresence.userID})`)
					.addField(`📤 ${lang.presenceupdateevent_old}:`, oldPresence.status)
					.addField(`📥 ${lang.presenceupdateevent_new}:`, newPresence.status);
				messagechannel.send({ embed: embed });
			}
		} catch (error) {
			console.error(error);
		}*/
	}
};
