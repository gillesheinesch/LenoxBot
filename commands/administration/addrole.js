exports.run = function(client, msg, args) {
	let addedrole = args.slice(1).join(' ');
	let user = msg.mentions.members.first();
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

	if (msg.mentions.members.size < 1) return msg.reply('You must mention a member to assign him a role!').then(m => m.delete(10000));
	if (addedrole.length < 1) return msg.reply('You must specify the name of the role!').then(m => m.delete(10000));
	if (!foundRole) return msg.reply('Höh ... This role does not exist at all!').then(m => m.delete(10000));
	if (user.roles.has(foundRole.id)) return msg.reply('The member already has this role!').then(m => m.delete(10000));

	user.addRole(foundRole).then(() => msg.reply('Role successfully assigned!').then(m => m.delete(10000))).catch(err =>
		msg.reply('Unfortunately, I do not have the rights to give this member the role!').then(m => m.delete(10000)));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ar'],
    userpermissions: ['MANAGE_ROLES']
};
exports.help = {
	name: 'addrole',
	description: 'Assign a role to a discord member',
	usage: 'addrole @User {rolename}',
	example: 'addrole @Monkeyyy11#7584 Member',
	category: 'administration',
    botpermissions: ['MANAGE_ROLES', 'SEND_MESSAGES']
};
