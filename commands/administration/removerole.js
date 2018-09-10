exports.run = (client, msg, args, lang) => {
	const addedrole = args.slice(1).join(' ');
	const user = msg.mentions.members.first();
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

	if (msg.mentions.members.size < 1) return msg.reply(lang.removerole_nomention);
	if (addedrole.length < 1) return msg.reply(lang.removerole_norolename);
	if (!foundRole) return msg.reply(lang.removerole_rolenotexist);
	if (!user.roles.has(foundRole.id)) return msg.reply(lang.removerole_error);

	user.removeRole(foundRole).then(() => msg.reply(lang.removerole_roleremoved)).catch(() =>
		msg.reply(lang.removerole_missingpermission));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Roles',
	aliases: ['rr'],
	userpermissions: ['MANAGE_ROLES'],
	dashboardsettings: true
};
exports.help = {
	name: 'removerole',
	description: 'Remove a role to a discord member',
	usage: 'removerole {@User} {name of the role}',
	example: ['removerole @Monkeyyy11#7584 Member'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES', 'MANAGE_ROLES']
};
