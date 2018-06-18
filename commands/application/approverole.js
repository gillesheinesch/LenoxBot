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
			archivechannellog: '',
			status: 'false'
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
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'approverole',
	description: 'Defines the role that members get if their application has been accepted',
	usage: 'approverole {name of the role}',
	example: ['approverole accepted'],
	category: 'application',
    botpermissions: ['SEND_MESSAGES']
};
