const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const input = args.slice();

	if (!msg.channel.nsfw) return msg.channel.send(lang.pornhubgif_nsfw);
	if (!input || input.length === 0) return msg.channel.send(lang.pornhubgif_type);
	if (args.slice() > 1) return msg.channel.send(lang.pornhubgif_error);
	const Pornsearch = require('pornsearch');

	try {
		/* eslint no-undef: 0 */
		const Searcher = new Pornsearch(args.slice().join(' '), driver = 'sex');
		const videos = await Searcher.videos();

		const result = Math.floor(Math.random() * videos.length);

		const url = videos[result - 1].url;
		const thumbnail = videos[result - 1].thumb;
		const title = videos[result - 1].title;
		const duration = videos[result - 1].duration;

		const durationembed = lang.sexvideo_durationembed.replace('%duration', duration);
		const embed = new Discord.RichEmbed()
			.setImage(thumbnail)
			.setURL(url)
			.setDescription(durationembed)
			.setColor('#ff0000')
			.setFooter(url)
			.setURL(url)
			.setAuthor(title);

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
	shortDescription: 'Videos',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'sexvideo',
	description: 'Searches for Sex videos',
	usage: 'sexvideo {query}',
	example: ['sexvideo ass', 'sexvideo tits'],
	category: 'nsfw',
	botpermissions: ['SEND_MESSAGES']
};
