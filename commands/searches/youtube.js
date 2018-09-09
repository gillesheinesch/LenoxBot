const config = require('../../settings.json');
const request = require("request");
const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
		const tableload = client.guildconfs.get(msg.guild.id);
	if (!args[0]) {
		return msg.channel.send(lang.youtube_noinput + tableload.prefix + "help " + msg.content.slice(config.prefix.length) + "`").then(m => m.delete(20000));
	}
	var url = "https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=" + args + "&maxResults=1&type=video&key=" + config.googlekey;
	request(url, function(err, response, body) {
		if (err) {
			console.log("[ERROR]" + err);
			return msg.channel.send(lang.youtube_error);
		}
		var search = JSON.parse(body);
		try {
			let title = search.items[0].snippet.title;
			let thumbnail = search.items[0].snippet.thumbnails.medium.url;
			let description = search.items[0].snippet.description;
			let url = "https://www.youtube.com/watch?v=" + search.items[0].id.videoId;
			const embed = new Discord.RichEmbed()
			.setImage(thumbnail)
			.setAuthor(title)
			.setDescription(description)
			.setURL(url)
			.setColor(0x00AE86)
			.setFooter(url);
			return msg.channel.send({ embed: embed });
		} catch (err) {
			return msg.channel.send(lang.youtube_noresult);
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: "General",
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
