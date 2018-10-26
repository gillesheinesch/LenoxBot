const config = require('../../settings.json');
const request = require('request');
const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	if (!args[0]) {
		const noinput = lang.youtube_noinput.replace('%prefix', tableload.prefix);
		return msg.channel.send(noinput);
	}
	const url = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=${args}&maxResults=1&type=video&key=${config.googlekey}`;
	request(url, (err, response, body) => {
		if (err) {
			console.log(`[ERROR]${err}`);
			return msg.channel.send(lang.youtube_error);
		}
		const search = JSON.parse(body);
		try {
			const title = search.items[0].snippet.title;
			const thumbnail = search.items[0].snippet.thumbnails.medium.url;
			const description = search.items[0].snippet.description;
			const newUrl = `https://www.youtube.com/watch?v=${search.items[0].id.videoId}`;
			const embed = new Discord.RichEmbed()
				.setImage(thumbnail)
				.setAuthor(title)
				.setDescription(description)
				.setURL(newUrl)
				.setColor(0x00AE86)
				.setFooter(newUrl);
			return msg.channel.send({ embed: embed });
		} catch (error) {
			return msg.channel.send(lang.youtube_noresult);
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: ['yt'],
	userpermissions: [],
	dashboardsettings: true
};

exports.help = {
	name: 'youtube',
	description: 'Searches for a video on youtube',
	usage: 'youtube {input}',
	example: ['youtube Discord'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
