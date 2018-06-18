const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	if (!msg.channel.nsfw) return msg.channel.send(lang.pornsearch_nsfw);
	if (!args.slice().length === 0) return msg.channel.send(lang.pornsearch_type);
	if (args.slice() > 1) return msg.channel.send(lang.pornsearch_error);
	const Pornsearch = require('pornsearch').default;

	try {
		const Searcher = new Pornsearch(args.slice().join(" "), driver = 'pornhub');
		var gifs = await Searcher.gifs();

		var result = Math.floor(Math.random() * gifs.length);

		var url = gifs[result - 1].url;
	
		const embed = new Discord.RichEmbed()
			.setImage(url)
			.setColor('#ff0000')
			.setURL(url)
			.setAuthor(url);
	
		msg.channel.send({
			embed
		});
	} catch (error) {
		return msg.reply(lang.pornhubgif_couldfindnothing);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: [], dashboardsettings: true
};
exports.help = {
	name: 'pornhubgif',
	description: 'Searches for Pornhub gifs',
	usage: 'pornhubgif {query}',
	example: ['pornhubgif ass', 'pornhubgif tits'],
	category: 'nsfw',
	botpermissions: ['SEND_MESSAGES']
};
