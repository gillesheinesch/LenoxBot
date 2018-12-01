exports.run = async (client, msg, args, lang) => {
	const Discord = require('discord.js');
	const Fortnite = require('fortnite');
	const fortniteclient = new Fortnite('f00bb1ee-0be8-4474-bbf4-58a382e3245d');

	const input = args.slice();

	if (!input || input.length === 0) return msg.reply(lang.fortnite_noinput);
	if (input.length < 1) return msg.reply(lang.fortnite_invalidconsole);
	if (input[0].toLowerCase() !== 'pc' && input[0].toLowerCase() !== 'psn' && input[0].toLowerCase() !== 'xbl') return msg.reply(lang.fortnite_invalidconsole);

	let stats;
	try {
		stats = await fortniteclient.getInfo(args.slice(1).join(' '), input[0]);
	} catch (error) {
		return msg.reply(lang.fortnite_playernotfound);
	}

	const statsEmbed = new Discord.RichEmbed()
		.setColor('BLUE')
		.setAuthor(`${stats.username} || ${stats.platformNameLong}`);

	for (let i = 0; i < stats.lifetimeStats.length; i++) {
		const stat = stats.lifetimeStats[i].stat;
		const value = stats.lifetimeStats[i].value;
		statsEmbed.addField(stat, value, true);
	}

	return msg.channel.send({
		embed: statsEmbed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'fortnite',
	description: 'Shows you Fortnite stats about a player on every console',
	usage: 'fortnite {pc, xbl, psn} {EpicGames Username}',
	example: ['fortnite psn Monkeyyy11ez'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
