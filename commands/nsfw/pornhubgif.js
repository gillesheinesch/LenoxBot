const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	if (!msg.channel.nsfw) return msg.channel.send(lang.pornhubgif_nsfw);
	if (!args.slice().length === 0) return msg.channel.send(lang.pornhubgif_type);
	if (args.slice() > 1) return msg.channel.send(lang.pornhubgif_error);
	const Pornsearch = require('pornsearch');

	try {
		/* eslint no-undef: 0 */
		const Searcher = new Pornsearch(args.slice().join(' '), driver = 'pornhub');
		const gifs = await Searcher.gifs();

		const result = Math.floor(Math.random() * gifs.length);

		const url = gifs[result - 1].url;

		const embed = new Discord.RichEmbed()
			.setImage(url)
			.setColor('#ff0000')
			.setURL(url)
			.setAuthor(url);

		return msg.channel.send({
			embed: embed
		});
	} catch (error) {
		return msg.reply(lang.pornhubgif_couldfindnothing);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'GIFS',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'pornhubgif',
	description: 'Searches for Pornhub gifs',
	usage: 'pornhubgif {query}',
	example: ['pornhubgif ass', 'pornhubgif tits'],
	category: 'nsfw',
	botpermissions: ['SEND_MESSAGES']
};
