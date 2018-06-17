const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const input = args.slice();

	if (input.length === 0) return msg.channel.send(lang.createrole_norolename);

	msg.guild.createRole({
		name: args.slice().join(" ")
	}).then(msg.channel.send(lang.createrole_rolecreated));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['MANAGE_ROLES']
};
exports.help = {
	name: 'createrole',
	description: 'Creates a role with a name',
	usage: 'createrole {rolename}',
	example: ['createrole Test'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']
};
