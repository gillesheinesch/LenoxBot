const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class pornhubvideoCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'pornhubvideo',
			group: 'nsfw',
			memberName: 'pornhubvideo',
			description: 'Searches for Pornhub videos',
			format: 'pornhubvideo {query}',
			aliases: [],
			examples: ['pornhubvideo ass', 'pornhubvideo tits'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Videos',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		if (!msg.channel.nsfw) return msg.channel.send(lang.pornhubgif_nsfw);
		if (args.length === 0) return msg.channel.send(lang.pornhubgif_type);
		const Pornsearch = require('pornsearch');

		try {
			/* eslint no-undef: 0 */
			const Searcher = await Pornsearch.search(args.join(' ')).videos();

			const result = Math.floor(Math.random() * Searcher.length);

			const url = Searcher[result - 1].url;
			const thumbnail = Searcher[result - 1].thumb;
			const title = Searcher[result - 1].title;
			const duration = Searcher[result - 1].duration;

			const durationembed = lang.sexvideo_durationembed.replace('%duration', duration);
			const embed = new Discord.MessageEmbed()
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
	}
};
