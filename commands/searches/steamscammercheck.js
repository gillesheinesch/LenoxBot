exports.run = (client, msg, args, lang) => {
	const SteamRepAPI = require('steamrep');

	if (args.slice().length < 1) return msg.channel.send(lang.steamscammercheck_validsteamid);
	if (isNaN(args.slice().join(''))) return msg.channel.send(lang.steamscammercheck_nosteamid);

	const id = args.slice();
	SteamRepAPI.timeout = 5000;
	SteamRepAPI.isScammer(id[0], (error, result) => {
		if (error) {
			return msg.channel.send(lang.steamscammercheck_error);
		}
		if (result) {
			const scammer = lang.steamscammercheck_scammer.replace('%author', msg.author);
			return msg.channel.send(scammer);
		}
		const notscammer = lang.steamscammercheck_notscammer.replace('%author', msg.author);
		return msg.channel.send(notscammer);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Steam',
	aliases: ['ssc'],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'steamscammercheck',
	description: 'Checks whether a Steam user was marked as scammer',
	usage: 'steamscammercheck {SteamID64}',
	example: ['steamscammercheck 76561198150711701'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
