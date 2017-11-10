exports.run = async (client, msg, args) => {
	const Discord = require('discord.js');
	const fortnite = require('fortnite');
	try {
		var stats = await fortnite(args[0], !args[1] ? 'PC' : args[1]);
		const embed = new Discord.RichEmbed()
		.setURL(stats.info.url)
		.setColor('#f45942')
		.setAuthor(`${stats.info.username} || ${stats.info.platform.toUpperCase()}`);
		for (var i = 0; i < stats.lifetimeStats.length; i++) {
            var stat = stats.lifetimeStats[i].stat;
            var value = stats.lifetimeStats[i].value;
            embed.addField(stat, value, true);
        }
		return msg.channel.send({ embed });
	} catch (error) {
		return msg.channel.send(1);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'fortnite',
	description: 'Shows you Fortnite stats about a player on every console',
	usage: 'fortnite {EpicGames Username} [PC, XBOX, PSN (pc default)]',
	example: 'fortnite Monkeyyy11ez PSN',
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
