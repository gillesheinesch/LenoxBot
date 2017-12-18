const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const input = args.slice();

	if (input.length === 0) return msg.channel.send('You forgot to enter the color and the name of the role!');
	if (input.length === 1) return msg.channel.send('You forgot to enter the name of the role!');

	msg.guild.createRole({
		name: args.slice(1).join(" "),
		color: input[0]
	}).then(msg.channel.send('The role was created successfully!'));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: ['MANAGE_ROLES']
};
exports.help = {
	name: 'createrole',
	description: 'Creates a role with a color and a name',
	usage: 'createrole {Color (Can be a Hex Literal, Hex String, Number)} {rolename}',
	example: ['createrole #336600 Test', 'createrole 255,255,255 Test', 'createrole 11,43%,55% Test'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']
};
