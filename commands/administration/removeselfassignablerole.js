exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const addedrole = args.slice().join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(' ').toLowerCase());

	if (addedrole.length < 1) return msg.reply(lang.removeselfassignablerole_noinput);
	if (!foundRole) return msg.reply(lang.removeselfassignablerole_rolenotexist);

	for (let i = 0; i < tableload.selfassignableroles.length; i++) {
		if (foundRole.id === tableload.selfassignableroles[i]) {
			const roleId = foundRole.id;
			for (let index = 0; index < tableload.selfassignableroles.length; index++) {
				if (roleId === tableload.selfassignableroles[index]) {
					tableload.selfassignableroles.splice(index, 1);
					client.guildconfs.set(msg.guild.id, tableload);
				}
			}
			client.guildconfs.set(msg.guild.id, tableload);

			return msg.channel.send(lang.removeselfassignablerole_roleremoved);
		}
	}
	return msg.channel.send(lang.removeselfassignablerole_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Selfassignableroles',
	aliases: ['rsar'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'removeselfassignablerole',
	description: 'Remove a role that allows users to assign themselves',
	usage: 'removeselfassignablerole {name of the role}',
	example: ['removeselfassignablerole Member'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
