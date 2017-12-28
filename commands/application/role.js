const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: ''
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (args.length < 1) return msg.reply('You forgot to insert the name of the role.');

	const role = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(" ").toLowerCase());
	if (!role) return msg.reply('This role does not exist at all!').then(m => m.delete(10000));

	tableload.application.role = role.id;
	await client.guildconfs.set(msg.guild.id, tableload);
	return msg.channel.send(`If an application has been accepted, the author of this application will now receive the ${role.name} 'role`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'role',
	description: 'Defines the role that members get if their application has been accepted',
	usage: 'role {name of the role}',
	example: ['role accepted'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
