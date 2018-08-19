exports.run = function(client, msg, args, lang) {
	let addedrole = args.slice(1).join(' ');
	let user = msg.mentions.members.first();
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

	if (msg.mentions.members.size < 1) return msg.reply(lang.removerole_nomention).then(m => m.delete(10000));
	if (addedrole.length < 1) return msg.reply(lang.removerole_norolename).then(m => m.delete(10000));
	if (!foundRole) return msg.reply(lang.removerole_rolenotexist).then(m => m.delete(10000));
	if (!user.roles.has(foundRole.id)) return msg.reply(lang.removerole_error).then(m => m.delete(10000));

	user.removeRole(foundRole).then(() => msg.reply(lang.removerole_roleremoved).then(m => m.delete(10000))).catch(err =>
		msg.reply(lang.removerole_missingpermission).then(m => m.delete(10000)));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
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
