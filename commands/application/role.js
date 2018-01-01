const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
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

	if (args.length < 1) return msg.reply(lang.role_noinput);

	const role = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(" ").toLowerCase());
	if (!role) return msg.reply(lang.role_rolenotexist).then(m => m.delete(10000));

	tableload.application.role = role.id;
	await client.guildconfs.set(msg.guild.id, tableload);

	var set = lang.role_set.replace('%rolename', role.name);
	return msg.channel.send(set);
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
