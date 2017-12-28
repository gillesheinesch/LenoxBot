const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	if (!msg.channel.nsfw) return msg.channel.send('The channel has to be NSFW!');
	if (!args.slice().length === 0) return msg.channel.send('You have to decide what type of pornography you want to see');
	if (args.slice() > 1) return msg.channel.send('Your input may not have any spaces!');
	const Pornsearch = require('pornsearch').default.search(args.slice().toString());


	var length = await Pornsearch.gifs().then(gifs => gifs.length);

	var result = Math.floor(Math.random() * length);

	var url = await Pornsearch.gifs().then(gifs => gifs[result - 1].url);

	const embed = new Discord.RichEmbed()
		.setImage(url)
		.setAuthor(msg.author.tag);

	msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};
exports.help = {
	name: 'pornsearch',
	description: 'Makes it possible to search for NSFW/pornography',
	usage: 'pornsearch {query}',
	example: ['pornsearch ass'],
	category: 'nsfw',
	botpermissions: ['SEND_MESSAGES']
};
