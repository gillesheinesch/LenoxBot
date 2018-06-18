const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const input = args.slice();

	// Wenn der Array länger ist wie 1 dann kommt eine Fehlermeldung da man nur verschiedene Wörter entfernen kann
	if (input.length !== 1) return msg.channel.send(lang.removechatfilter_error);

	if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	// Check ob der Eintrag überhaupt existiert
	for (let i = 0; i < tableload.chatfilter.array.length; i++) {
		if (input.join(" ").toLowerCase() === tableload.chatfilter.array[i]) {
			tableload.chatfilter.array.splice(i, 1);
			await client.guildconfs.set(msg.guild.id, tableload);

			const removed = lang.removechatfilter_removed.replace('%input', input.join(" "));
			msg.channel.send(removed);
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],

	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true

};
exports.help = {
	name: 'removechatfilter',
	description: 'Removes words from the chatfilter',
	usage: 'removechatfilter bitch',
	example: ['removechatfilter bitch', 'removechatfilter idiot'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
