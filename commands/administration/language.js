const LenoxCommand = require('../LenoxCommand.js');

module.exports = class languageCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'language',
			group: 'administration',
			memberName: 'language',
			description: 'Changes the language of the bot for this server',
			format: 'language {desired language}',
			aliases: [],
			examples: ['language', 'language german', 'language english', 'language spanish', 'language french', 'language swiss'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['ADMINISTRATOR'],
			shortDescription: 'Localization',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const margs = msg.content.split(' ');
		const args = msg.content.split(' ').slice(1);
		const input = args.slice();

		const validation = ['english', 'german', 'french', 'spanish', 'swiss'];

		const already = lang.language_already.replace('%language', `\`${input[0]}\``);
		const changed = lang.language_changed.replace('%input', `\`${input[0]}\``);

		if (!input || input.length === 0) return msg.reply(lang.language_noinput);

		for (let i = 0; i < margs.length; i++) {
			if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
				if (margs[1].toLowerCase() === 'english') {
					if (langSet === 'en-US') return msg.channel.send(already);

					await msg.client.provider.setGuild(msg.message.guild.id, 'language', 'en-US');
					await msg.client.provider.setGuild(msg.message.guild.id, 'momentLanguage', 'en');

					return msg.channel.send(changed);
				} else if (margs[1].toLowerCase() === 'german') {
					if (langSet === 'de-DE') return msg.channel.send(already);

					await msg.client.provider.setGuild(msg.message.guild.id, 'language', 'de-DE');
					await msg.client.provider.setGuild(msg.message.guild.id, 'momentLanguage', 'de');

					return msg.channel.send(changed);
				} else if (margs[1].toLowerCase() === 'french') {
					if (langSet === 'fr-FR') return msg.channel.send(already);

					await msg.client.provider.setGuild(msg.message.guild.id, 'language', 'fr-FR');
					await msg.client.provider.setGuild(msg.message.guild.id, 'momentLanguage', 'fr');

					return msg.channel.send(changed);
				} else if (margs[1].toLowerCase() === 'spanish') {
					if (langSet === 'es-ES') return msg.channel.send(already);

					await msg.client.provider.setGuild(msg.message.guild.id, 'language', 'es-ES');
					await msg.client.provider.setGuild(msg.message.guild.id, 'momentLanguage', 'es');

					return msg.channel.send(changed);
				} else if (margs[1].toLowerCase() === 'swiss') {
					if (langSet === 'de-CH') return msg.channel.send(already);

					await msg.client.provider.setGuild(msg.message.guild.id, 'language', 'de-CH');
					await msg.client.provider.setGuild(msg.message.guild.id, 'momentLanguage', 'de-CH');

					return msg.channel.send(changed);
				}
			}
		}
		return msg.channel.send(lang.language_error);
	}
};
