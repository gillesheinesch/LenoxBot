const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { JSDOM } = require('jsdom');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_HENTAIHAVEN_DESCRIPTION'),
			requiredPermissions: ['SEND_MESSAGES'],
			nsfw: true
		});
	}

	async run(message) {
		try {
			/* eslint no-undef: 0 */
			await JSDOM.fromURL('https://hentaihaven.org').then(async(res) => {
				const elements = res.window.document.querySelectorAll('head > script');
				const element = Array.from(elements).filter(elem => elem.text.startsWith('/*  */\nvar Pukka = '))[0];
				const Pukka = JSON.parse(element.text.replace(/^\/\* {2}\*\/\nvar Pukka = |\;\n\/\* {2}\*\/$/g, ''));
				const random_category = Pukka.category_links[Math.floor(Math.random() * (Pukka.category_links.length - 1))];
				await JSDOM.fromURL(random_category).then(resource => {
					const document = resource.window.document;
					const title = document.getElementsByClassName('archive-title')[0].textContent;
					const videos = document.getElementsByClassName('hidden animate_video');
					const video_selection = Math.floor(Math.random() * (videos.length - 1)); // select a random video off the page
					const video_url = videos[video_selection].attributes[1].value;
					const thumbnail_url = document.getElementsByClassName('hidden animate_image')[video_selection].attributes[1].value || document.getElementsByClassName('hidden solid_image')[video_selection].attributes[1].value || document.getElementsByClassName('lazy attachment-medium post-image')[video_selection].attributes[4].value;
					return message.channel.send(new MessageEmbed()
						.setImage(thumbnail_url)
						.setURL(video_url)
						.setFooter(video_url)
						.setColor('BLUE')
						.setTitle(title));
				}).catch(err => {
					throw err;
				});
			}).catch(err => {
				throw err;
			});
		} catch (err) {
			return message.reply(message.language.get('COMMAND_HENTAIHAVEN_NOTFIND'));
		}
	}
};
