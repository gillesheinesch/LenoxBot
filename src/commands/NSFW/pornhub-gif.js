const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const Pornsearch = require('pornsearch');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_PORNHUBGIF_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_PORNHUBGIF_EXTENDEDHELP'),
			usage: '<query:str>',
			requiredPermissions: ['SEND_MESSAGES'],
			nsfw: true
		});
	}

	async run(message, [query]) {
		const args = query.split(' ');
		if (!args.slice().length === 0) return message.channel.sendLocale('COMMAND_PORNHUBGIF_TYPE');
		if (args.slice() > 1) return message.channel.sendLocale('COMMAND_PORNHUBGIF_ERROR');

		try {
		/* eslint no-undef: 0 */
			const Searcher = await Pornsearch.search(args.slice().join(' ')).gifs();

			const result = Math.floor(Math.random() * Searcher.length);
			const url = Searcher[result - 1].url;

			return message.channel.send(new MessageEmbed()
				.setImage(url)
				.setColor('#ff0000')
				.setURL(url)
				.setAuthor(url));
		} catch (err) {
			return message.reply(message.language.get('COMMAND_PORNHUBGIF_COULDFINDNOTHING'));
		}
	}
};
