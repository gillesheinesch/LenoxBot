const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
    const input = args.slice();

	if (!msg.channel.nsfw) return msg.channel.send(lang.pornsearch_nsfw);
	if (!input || input.length === 0) return msg.channel.send(lang.pornsearch_type);
	if (args.slice() > 1) return msg.channel.send(lang.pornsearch_error);
	const Pornsearch = require('pornsearch').default;

	try {
		const Searcher = new Pornsearch(args.slice().join(" "), driver = 'pornhub');
        var videos = await Searcher.videos();

		var result = Math.floor(Math.random() * videos.length);

        var url = videos[result - 1].url;
        var thumbnail = videos[result - 1].thumb;
        var title = videos[result - 1].title;
		var duration = videos[result - 1].duration;
		
		const durationembed = lang.sexvideo_durationembed.replace('%duration', duration);
		const embed = new Discord.RichEmbed()
            .setImage(thumbnail)
            .setURL(url)
            .setDescription(durationembed)
			.setColor('#ff0000')
			.setFooter(url)
			.setURL(url)
			.setAuthor(title);
	
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
<<<<<<< HEAD
	userpermissions: []
=======
	userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'pornhubvideo',
	description: 'Searches for Pornhub videos',
	usage: 'pornhubvideo {query}',
	example: ['pornhubvideo ass', 'pornhubvideo tits'],
	category: 'nsfw',
	botpermissions: ['SEND_MESSAGES']
};
