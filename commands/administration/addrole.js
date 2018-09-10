exports.run = (client, msg, args, lang) => {
	const addedrole = args.slice(1).join(' ');
	const user = msg.mentions.members.first();
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

	if (msg.mentions.members.size < 1) return msg.reply(lang.addrole_nomention);
	if (addedrole.length < 1) return msg.reply(lang.addrole_norolename);
	if (!foundRole) return msg.reply(lang.addrole_rolenotexist);
	if (user.roles.has(foundRole.id)) return msg.reply(lang.addrole_memberalreadyhasrole);

	user.addRole(foundRole).then(() => msg.reply(lang.addrole_roleassigned)).catch(() =>
		msg.reply(lang.addrole_norights));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Roles',
	aliases: ['ar'],
	userpermissions: ['MANAGE_ROLES'],
	dashboardsettings: true
};
exports.help = {
	name: 'addrole',
	description: 'Assign a role to a discord member',
	usage: 'addrole {@User} {name of the role}',
	example: ['addrole @Monkeyyy11#7584 Member'],
	category: 'administration',
	botpermissions: ['MANAGE_ROLES', 'SEND_MESSAGES']
};
