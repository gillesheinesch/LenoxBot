const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const input = args.slice();

	// Wenn der Array länger ist wie 1 dann kommt eine Fehlermeldung da man nur verschiedene Wörter einfügen kann
	if (input.length !== 1) return msg.channel.send(lang.addchatfilter_error);

	if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	// Check ob der Eintrag bereits im Chatfilter vorhanden ist
	for (let i = 0; i < tableload.chatfilter.array.length; i++) {
		if (input.join(" ").toLowerCase() === tableload.chatfilter.array[i].toLowerCase()) return msg.channel.send(lang.addchatfilter_already);
	}

	tableload.chatfilter.array.push(input.join(" ").toLowerCase());
	await client.guildconfs.set(msg.guild.id, tableload);

	const added = lang.addchatfilter_added.replace('%input', input.join(" "));
	msg.channel.send(added);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
	userpermissions: ['ADMINISTRATOR']
=======
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'addchatfilter',
	description: 'Inserts a new entry in the chat filter',
	usage: 'addchatfilter',
	example: ['addchatfilter bitch', 'addchatfilter idiot'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
