exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const addedrole = args.slice().join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

	if (addedrole.length < 1) return msg.reply(lang.addselfassignablerole_norolename);
	if (!foundRole) return msg.reply(lang.addselfassignablerole_rolenotexist);
	for (let i = 0; i < tableload.selfassignableroles.length; i++) {
		if (foundRole.id === tableload.selfassignableroles[i]) return msg.channel.send(lang.addselfassignablerole_alreadyadded);
	}
	const roleId = foundRole.id;
	tableload.selfassignableroles.push(roleId);
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.addselfassignablerole_roleset);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Selfassignableroles',
	aliases: ['asar'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'addselfassignablerole',
	description: 'Add a role that allows users to assign themselves',
	usage: 'addselfassignablerole {name of the role}',
	example: ['addselfassignablerole Member'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
