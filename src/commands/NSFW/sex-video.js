const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Pornsearch = require('pornsearch');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_SEXVIDEO_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_SEXVIDEO_EXTENDEDHELP'),
			usage: '<Query:str>',
			requiredPermissions: ['SEND_MESSAGES'],
			nsfw: true
		});
	}

	async run(message, [query]) {
		const args = query.split(' ');

		const input = args.slice();

		if (!input || !input.length) return message.channel.sendLocale('COMMAND_PORNHUBGIF_TYPE');
		if (args.slice() > 1) return message.channel.sendLocale('COMMAND_PORNHUBGIF_ERROR');

		try {
		/* eslint no-undef: 0 */
			const Searcher = new Pornsearch(args.slice().join(' '), 'sex');
			const videos = await Searcher.videos();

			const result = Math.floor(Math.random() * videos.length);

			const url = videos[result - 1].url;
			const thumbnail = videos[result - 1].thumb;
			const title = videos[result - 1].title;
			const duration = videos[result - 1].duration;

			const durationembed = message.language.get('SEXVIDEO_DURATIONEMBED', duration);
			return message.channel.send(new MessageEmbed()
				.setImage(thumbnail)
				.setURL(url)
				.setDescription(durationembed)
				.setColor('#ff0000')
				.setFooter(url)
				.setURL(url)
				.setAuthor(title));
		} catch (err) {
			return message.reply(message.language.get('COMMAND_PORNHUBGIF_COULDFINDNOTHING'));
		}
	}
};
