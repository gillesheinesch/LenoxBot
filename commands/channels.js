exports.run = (client, msg, args) => {
	msg.channel.sendMessage('', {
		embed: {
			color: 3447003,
			description: `**📋 All text-channels:**\n${msg.guild.channels.filter(textChannel => textChannel.type === `text`).map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`).join('\n') || 'No text-channels on this server!'}`

		}
	});
	msg.channel.sendMessage('', {
		embed: {
			color: 3447003,
			description: `**📡 All voice-channels:**\n${msg.guild.channels.filter(voiceChannel => voiceChannel.type === `voice`).map(voicechannel => `**${voicechannel.name}** (*${voicechannel.id}*)`).join('\n') || 'No voice-channels on this server!'}`
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};
exports.help = {
	name: 'channels',
	description: 'A list of all channels on your discord server',
	usage: 'channels',
	example: 'channels'
};
