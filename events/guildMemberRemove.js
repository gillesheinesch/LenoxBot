const Discord = require('discord.js');
module.exports = {
	run: member => {
		if (!client.provider.isReady) return;
		if (client.user.id === member.id) return;

		if (!client.provider.getGuild(member.guild.id, 'prefix')) return;

		const lang = require(`../languages/${client.provider.getGuild(member.guild.id, 'language')}.json`);

		if (client.provider.getGuild(member.guild.id, 'byelog') === 'true') {
			const messagechannel = client.channels.get(client.provider.getGuild(member.guild.id, 'byelogchannel'));
			const embed = new Discord.MessageEmbed()
				.setFooter(lang.guildmemberremoveevent_userleft)
				.setTimestamp()
				.setColor('RED')
				.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.avatarURL());
			messagechannel.send({
				embed: embed
			});
		}

		let embed = false;
		if (client.provider.getGuild(member.guild.id, 'bye') === 'true') {
			if (client.provider.getGuild(member.guild.id, 'byemsg').length < 1) return;
			const messagechannel = client.channels.get(client.provider.getGuild(member.guild.id, 'byechannel'));
			if (client.provider.getGuild(member.guild.id, 'byemsg').toLowerCase().includes('$embed$')) {
				embed = true;
			}
			const newMessage = client.provider.getGuild(member.guild.id, 'byemsg').replace('$username$', member.user.username)
				.replace('$usertag$', member.user.tag)
				.replace('$userid$', member.user.id)
				.replace('$guildname$', member.guild.name)
				.replace('$guildid$', member.guild.id)
				.replace('$embed$', '');

			if (embed) {
				const byeEmbed = new Discord.MessageEmbed()
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
	}
};
