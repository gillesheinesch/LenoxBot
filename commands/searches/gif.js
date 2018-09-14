const got = require('got');
const API_KEY = 'dc6zaTOxFJmzC';
const Discord = require('discord.js');

exports.run = async (client, msg, args, lang) => {
	if (args.length < 1) {
		return msg.channel.send(lang.gif_noinput);
	}

	const res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${encodeURIComponent(args.join(' '))}`, {
		json: true
	});

	if (!res.body.data.image_url) {
		return msg.channel.send(lang.gif_error);
	}

	const embed = new Discord.RichEmbed()
		.setImage(`${res.body.data.image_url}`)
		.setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
		.setColor('#0066CC');
	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'gif',
	description: 'Searches for a gif',
	usage: 'gif {query}',
	example: ['gif Discord', 'gif Fortnite'],
	category: 'searches',
	botpermissions: ['SEND_MESSAGES']
};
