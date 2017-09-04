exports.run = function(client, msg, args) {
	if (!msg.member.hasPermission('MANAGE_ROLES')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));

	let addedrole = args.slice(1).join(' ');
	let user = msg.mentions.members.first();
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice(1).join(' ').toLowerCase());

	if (msg.mentions.members.size < 1) return msg.reply('You must mention a member to remove him a role!').then(m => m.delete(10000));
	if (addedrole.length < 1) return msg.reply('You must specify the name of the role!').then(m => m.delete(10000));
	if (!foundRole) return msg.reply('Höh ... This role does not exist at all!').then(m => m.delete(10000));
	if (!user.roles.has(foundRole.id)) return msg.reply('Der Member hat diese Rolle nicht.').then(m => m.delete(10000));

	user.removeRole(foundRole).then(() => msg.reply('Role successfully removed!').then(m => m.delete(10000))).catch(err =>
		msg.reply('Unfortunately, I do not have the rights to remove this member the role!').then(m => m.delete(10000)));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['rr']
};
exports.help = {
	name: 'removerole',
	description: 'Remove a role to a discord member',
	usage: 'removerole @User {rolename}',
	example: 'removerole @Monkeyyy11#7584 Member',
	category: 'administration'
};
