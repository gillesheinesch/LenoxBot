const Discord = require('discord.js');
exports.run = (client, msg, args) => {
	const SteamRepAPI = require('steamrep');
	const ms = require('ms');

	if (args.slice().length < 1) return msg.channel.send('Please make sure that you have inserted a valid SteamID64! Here you can get your Steam64ID: https://steamid.io/');
	if (isNaN(args.slice().join(""))) return msg.channel.send('This isn\'t a Steam64ID. Here you can get your Steam64ID: https://steamid.io/');

	const id = args.slice();
	SteamRepAPI.timeout = 5000;
	SteamRepAPI.isScammer(id[0], function(error, result) {
		if(error) {
			return msg.channel.send('That Steamprofile could not be found. Please make sure, that you have insert a valid SteamID64.');
		} else {
		  if(result) {
			return msg.channel.send(`${msg.author}, This user was marked as **"scammer"**!`);
		  } else {
			  return msg.channel.send(`${msg.author}, This user wasn't marked as **"scammer"**!`);
		  }
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ssc'],
	userpermissions: []
};

exports.help = {
	name: 'steamscammercheck',
	description: 'Checks whether a Steam user was marked as scammer',
	usage: 'steamscammercheck {SteamID64}',
	example: ['steamscammercheck 76561198150711701'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
