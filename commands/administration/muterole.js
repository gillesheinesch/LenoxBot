const Discord = require('discord.js');

exports.run = async(client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (args.length < 1) return msg.reply(lang.muterole_noinput);

	const role = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(" ").toLowerCase());
	if (!role) return msg.reply(lang.muterole_rolenotexist).then(m => m.delete(10000));

	if (!tableload.muterole) {
		tableload.muterole = '';
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	tableload.muterole = role.id;
	await client.guildconfs.set(msg.guild.id, tableload);
	msg.channel.send(lang.muterole_mutedroleset);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['m'],
<<<<<<< HEAD
	userpermissions: ['ADMINISTRATOR']
=======
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'muterole',
	description: 'Defines a muted role which muted users will get',
	usage: 'muterole {rolename}',
	example: ['muterole muted'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
