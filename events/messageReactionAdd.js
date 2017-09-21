const Discord = require('discord.js');
exports.run = (client, messageReaction, user) => {
	const tableload = client.guildconfs.get(messageReaction.message.guild.id);

	if (user.id === messageReaction.message.author.id) return messageReaction.message.channel.send('You can not give a star on your own message');

	if (tableload.starboard === 'false') return;

	if (messageReaction.emoji.name === '⭐') {
		if (messageReaction.count === 1) {
			const starboardchannel = client.channels.get(tableload.starboardchannel);

			const embed = new Discord.RichEmbed()
		.setColor('#a6a4a8')
		.setTimestamp()
		.setFooter(`⭐${messageReaction.count++}`)
		.setDescription(`**Message:** \n ${messageReaction.message.content}`)
		.setAuthor(`${messageReaction.message.author.tag} (${messageReaction.message.author.id})`, messageReaction.message.author.displayAvatarURL);
			starboardchannel.send({ embed }).then(m => client.starboard.set(messageReaction.message.id, {
				msgid: m.id,
				channel: m.channel.id
			}));
		} else if (messageReaction.count > 1) {
			const table = client.starboard.get(messageReaction.message.id);
			const starboardch = client.channels.get(table.channel);

			const embed = new Discord.RichEmbed()
			.setColor('#a6a4a8')
			.setTimestamp()
			.setFooter(`⭐${messageReaction.count - 1}`)
			.setDescription(`**Message:** \n ${messageReaction.message.content}`)
			.setAuthor(`${messageReaction.message.author.tag} (${messageReaction.message.author.id})`, messageReaction.message.author.displayAvatarURL);

			starboardch.fetchMessage(table.msgid).then(m => m.edit({ embed }));
		}
	}
};
