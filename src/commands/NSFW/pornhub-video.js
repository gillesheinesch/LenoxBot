const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Pornsearch = require('pornsearch');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PORNHUBVIDEO_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_PORNHUBVIDEO_EXTENDEDHELP'),
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
			const Searcher = await Pornsearch.search(args.slice().join(' ')).videos();

			const result = Math.floor(Math.random() * Searcher.length);

			const url = Searcher[result - 1].url;
			const thumbnail = Searcher[result - 1].thumb;
			const title = Searcher[result - 1].title;
			const duration = Searcher[result - 1].duration;

			const durationembed = message.language.get('SEXVIDEO_DURATIONEMBED', duration);
			return message.channel.send(new MessageEmbed()
				.setImage(thumbnail)
				.setURL(url)
				.setDescription(durationembed)
				.setColor('#ff0000')
				.setFooter(url)
				.setURL(url)
				.setAuthor(title)
			);
		} catch (err) {
			return message.reply(message.language.get('COMMAND_PORNHUBGIF_COULDFINDNOTHING'));
		}
	}
};