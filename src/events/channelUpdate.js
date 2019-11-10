const Discord = require('discord.js');
module.exports = {
	run: (oldChannel, newChannel) => {
		if (!oldChannel || !newChannel) return;
		if (newChannel.type !== 'text' || oldChannel.type !== 'text') return;
		if (!client.provider.isReady) return;

		if (!client.provider.getGuild(oldChannel.guild.id, 'prefix')) return;
		if (client.provider.getGuild(oldChannel.guild.id, 'channelupdatelog') === 'false') return;

		const langSet = client.provider.getGuild(oldChannel.guild.id, 'language');
		const lang = require(`../languages/${langSet}.json`);

		if (!client.channels.get(client.provider.getGuild(oldChannel.guild.id, 'channelupdatelogchannel'))) return;

		const messagechannel = client.channels.get(client.provider.getGuild(oldChannel.guild.id, 'channelupdatelogchannel'));
		if (!messagechannel) return;

		if (oldChannel.name !== newChannel.name) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.channelupdateevent_nameupdated)
				.addField(`📎 ${lang.channelcreateevent_channelid}:`, oldChannel.id)
				.addField(`📤 ${lang.channelupdateevent_oldname}`, oldChannel.name)
				.addField(`📥 ${lang.channelupdateevent_newname}`, newChannel.name);
			return messagechannel.send({
				embed: embed
			});
		}
		if (oldChannel.topic !== newChannel.topic) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.channelupdateevent_topicupdated)
				.addField(`⚙ ${lang.channelcreateevent_channelname}`, oldChannel.name)
				.addField(`📎 ${lang.channelcreateevent_channelid}`, oldChannel.id)
				.addField(`📤 ${lang.channelupdateevent_oldtopic}`, oldChannel.topic ? oldChannel.topic : lang.channelupdateevent_nochanneltopic)
				.addField(`📥 ${lang.channelupdateevent_newtopic}`, newChannel.topic ? newChannel.topic : lang.channelupdateevent_nochanneltopic);
			return messagechannel.send({
				embed: embed
			});
		}
		if (oldChannel.rawPosition !== newChannel.rawPosition) {
			const embed = new Discord.MessageEmbed()
				.setColor('ORANGE')
				.setTimestamp()
				.setAuthor(lang.channelupdateevent_positionupdated)
				.addField(`⚙ ${lang.channelcreateevent_channelname}:`, oldChannel.name)
				.addField(`📎 ${lang.channelcreateevent_channelid}`, oldChannel.id)
				.addField(`📤 ${lang.channelupdateevent_oldposition}`, oldChannel.rawPosition)
				.addField(`📥 ${lang.channelupdateevent_newposition}`, newChannel.rawPosition);
			return messagechannel.send({
				embed: embed
			});
		}
	}
};
