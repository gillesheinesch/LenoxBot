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
<<<<<<< HEAD
	userpermissions: ['ADMINISTRATOR']
=======
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'channelblacklist',
	description: 'Displays a list of which voicechannels have been blacklisted',
	usage: 'channelblacklist',
	example: ['channelblacklist'],
	category: 'music',
	botpermissions: ['SEND_MESSAGES']
};
