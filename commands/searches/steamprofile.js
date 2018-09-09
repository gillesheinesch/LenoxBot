const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const SteamRepAPI = require('steamrep');
	const ms = require('ms');

	if (args.slice().length < 1) return msg.channel.send(lang.steamprofile_validsteamid);
	if (isNaN(args.slice().join(''))) return msg.channel.send(lang.steamprofile_nosteamid);

	const id = args.slice();
	SteamRepAPI.timeout = 5000;
	SteamRepAPI.getProfile(id[0], (error, result) => {
		if (result.steamrep.flags.status !== 'notfound') {
			const embed = new Discord.RichEmbed()
				.setImage(result.steamrep.avatar)
				.setColor('#336600')
				.addField('SteamID64', result.steamrep.steamID64, true)
				.addField(lang.steamprofile_rep, result.steamrep.reputation.summary)
				.addField(lang.steamprofile_tban, result.steamrep.tradeban, true)
				.addField(lang.steamprofile_vban, result.steamrep.vacban, true)
				.addField(lang.steamprofile_membersince, `${ms(result.steamrep.membersince * 1000, { 'long': true })} (${new Date(result.steamrep.membersince * 1000).toUTCString()})`)
				.setAuthor(result.steamrep.displayname, result.steamrep.avatar);

			if (result.steamrep.customurl !== '') {
				embed.setURL(`http://steamcommunity.com/id/${result.steamrep.customurl}`);
			}
			return msg.channel.send({ embed });
		}
		 msg.channel.send(lang.steamprofile_error);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Steam',
	aliases: ['sp'],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'steamprofile',
	description: 'Requests Steam profile informations of a Steamuser',
	usage: 'steamprofile {SteamID64}',
	example: ['steamprofile 76561198150711701'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
