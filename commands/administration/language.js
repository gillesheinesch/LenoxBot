exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const margs = msg.content.split(' ');
	const input = args.slice();

	const validation = ['english', 'german', 'french'];

	const already = lang.language_already.replace('%language', `\`${input[0]}\``);
	const changed = lang.language_changed.replace('%input', `\`${input[0]}\``);

	if (!input || input.length === 0) return msg.reply(lang.language_noinput);

	for (let i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'english') {
				if (tableload.language === 'en-US') return msg.channel.send(already);

				tableload.language = 'en-US';
				tableload.momentLanguage = 'en';
				await client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(changed);
			} else if (margs[1].toLowerCase() === 'german') {
				if (tableload.language === 'de-DE') return msg.channel.send(already);

				tableload.language = 'de-DE';
				tableload.momentLanguage = 'de';
				await client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(changed);
			} else if (margs[1].toLowerCase() === 'french') {
				if (tableload.language === 'fr-FR') return msg.channel.send(already);

				tableload.language = 'fr-FR';
				tableload.momentLanguage = 'fr';
				await client.guildconfs.set(msg.guild.id, tableload);

				return msg.channel.send(changed);
			}
		}
	}
	return msg.channel.send(lang.language_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Localization',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'language',
	description: 'Changes the language of the bot for this server',
	usage: 'language {name of the language (in english)}',
	example: ['language', 'language german', 'language english'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
