const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (tableload.musicchannelblacklist.length === 0) return msg.reply(lang.channelblacklist_error);

	var array = [];

	for (var i = 0; i < tableload.musicchannelblacklist.length; i++) {
		try {
			const channelname = msg.guild.channels.get(tableload.musicchannelblacklist[i]).name;
			array.push(`${channelname} (${tableload.musicchannelblacklist[i]})`);
		} catch (error) {
			tableload.musicchannelblacklist.splice(i, 1);
			await client.guildconfs.set(msg.guild.id, tableload);
		}
	}

	const embed = new Discord.RichEmbed()
	.setColor('#ff9933')
	.setDescription(array.join("\n"))
	.setAuthor(lang.channelblacklist_embed);

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'channelblacklist',
	description: 'Shows you how long the bot needs to send a message',
	usage: 'ping',
	example: ['ping'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
