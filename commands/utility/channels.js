exports.run = (client, msg, args, lang) => {
	msg.channel.sendMessage('', {
		embed: {
			color: 3447003,
			description: `**📋 ${lang.channels_textchannels}**\n${msg.guild.channels.filter(textChannel => textChannel.type === `text`).map(textchannel => `**#${textchannel.name}** (*${textchannel.id}*)`).join('\n') || lang.channels_notextchannels}`

		}
	});
	msg.channel.sendMessage('', {
		embed: {
			color: 3447003,
			description: `**📡 ${lang.channels_voicechannels}**\n${msg.guild.channels.filter(voiceChannel => voiceChannel.type === `voice`).map(voicechannel => `**${voicechannel.name}** (*${voicechannel.id}*)`).join('\n') || lang.channels_novoicechannels}`
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'channels',
	description: 'A list of all channels on your discord server',
	usage: 'channels',
	example: ['channels'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
