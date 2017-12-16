const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const SteamRepAPI = require('steamrep');
	const ms = require('ms');

	if (args.slice().length < 1) return msg.channel.send('Please make sure that you have inserted a valid SteamID64! Here you can get your Steam64ID: https://steamid.io/');
	if (isNaN(args.slice().join(""))) return msg.channel.send('This isn\'t a Steam64ID. Here you can get your Steam64ID: https://steamid.io/');

	const id = args.slice();
	SteamRepAPI.timeout = 5000;
	SteamRepAPI.getProfile(id[0], function(error, result) {
	if(result.steamrep.flags.status !== 'notfound') {
		const embed = new Discord.RichEmbed()
		.setImage(result.steamrep.avatar)
		.setColor("#336600")
		.addField('SteamID64', result.steamrep.steamID64, true)
		.addField('Reputation', result.steamrep.reputation.summary)
		.addField('Trade ban(s)', result.steamrep.tradeban, true)
		.addField('VAC ban(s)', result.steamrep.vacban, true)
		.addField('Member since', `${ms(result.steamrep.membersince * 1000, { long: true })} (${new Date(result.steamrep.membersince * 1000).toUTCString()})`)
		.setAuthor(result.steamrep.displayname, result.steamrep.avatar);

		if (result.steamrep.customurl !== '') {
			embed.setURL(`http://steamcommunity.com/id/${result.steamrep.customurl}`);
		}
		return msg.channel.send({ embed });
	} else {
		 msg.channel.send('That Steamprofile could not be found. Please make sure, that you have insert a valid SteamID64.');
	}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['sp'],
	userpermissions: []
};

exports.help = {
	name: 'steamprofile',
	description: 'Requests Steam profile informations of a Steamuser',
	usage: 'steamprofile {SteamID64}',
	example: ['steamprofile 76561198150711701'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
