exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const input = args.slice();

	// Wenn der Array länger ist wie 1 dann kommt eine Fehlermeldung da man nur verschiedene Wörter einfügen kann
	if (input.length !== 1) return msg.channel.send(lang.addchatfilter_error);

	if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		client.guildconfs.set(msg.guild.id, tableload);
	}

	// Check ob der Eintrag bereits im Chatfilter vorhanden ist
	for (let i = 0; i < tableload.chatfilter.array.length; i++) {
		if (input.join(' ').toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) return msg.channel.send(lang.addchatfilter_already);
	}

	tableload.chatfilter.array.push(input.join(' ').toLowerCase());
	client.guildconfs.set(msg.guild.id, tableload);

	const added = lang.addchatfilter_added.replace('%input', input.join(' '));
	msg.channel.send(added);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Chatfilter',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
};
exports.help = {
	name: 'addchatfilter',
	description: 'Inserts a new entry in the chat filter',
	usage: 'addchatfilter {word}',
	example: ['addchatfilter bitch', 'addchatfilter idiot'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
