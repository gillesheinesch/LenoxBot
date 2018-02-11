exports.run = async(client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	const Discord = require('discord.js');
	const fortnite = require('fortnite');

	const input = args.slice();

	if (!input[0]) return msg.channel.send(lang.fortnite_noinput);

	var stats = await fortnite(input[0], !input[1] ? 'PC' : input[1]);

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
	example: ['fortnite Monkeyyy11ez PSN'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
