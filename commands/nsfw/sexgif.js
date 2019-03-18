const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class sexgifCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'sexgif',
			group: 'nsfw',
			memberName: 'sexgif',
			description: 'Searches for sex gifs',
			format: 'sexgif {query}',
			aliases: [],
			examples: ['sexgif ass', 'sexgif tits'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'GIFS',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		if (!msg.channel.nsfw) return msg.channel.send(lang.pornhubgif_nsfw);
		if (!args.slice().length === 0) return msg.channel.send(lang.pornhubgif_type);
		if (args.slice() > 1) return msg.channel.send(lang.pornhubgif_error);
		const Pornsearch = require('pornsearch');

		try {
		/* eslint no-undef: 0 */
			const Searcher = new Pornsearch(args.slice().join(' '), driver = 'sex');
			const gifs = await Searcher.gifs();

			const result = Math.floor(Math.random() * gifs.length);

			const url = gifs[result - 1].url;

			const embed = new Discord.RichEmbed()
				.setImage(url)
				.setColor('#ff0000')
				.setURL(url)
				.setAuthor(url);

			return msg.channel.send({
				embed: embed
			});
		} catch (error) {
			return msg.reply(lang.pornhubgif_couldfindnothing);
		}
	}
};
