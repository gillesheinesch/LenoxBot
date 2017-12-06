exports.run = async(client, msg, args) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	
	if (!tableload.ara) {
		tableload.ara = [];
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	let input = args.slice();

	if (!input[0]) return msg.reply('You have to insert the required points for a user to get the role.').then(m => m.delete(10000));
	if (parseInt(input[0]) < 0) return msg.reply('The required number of points for a user to get the role cannot be under 0.');
	if (!args.slice(1).join(" ")) return msg.reply('You have to insert the name of the role.').then(m => m.delete(10000));

	let roleinput = args.slice(1).join(" ");
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === roleinput.toLowerCase());
	if (!foundRole) return msg.reply('Höh ... This role does not exist at all!').then(m => m.delete(10000));

		for (var i = 0; i < tableload.ara.length;  i += 2) {
			if (foundRole.id === tableload.ara[i]) return msg.channel.send('You have already added the role to the auto assignable roles.');
		}
		const roleId = foundRole.id;
		tableload.ara.push(roleId);
		tableload.ara.push(input[0]);
		await client.guildconfs.set(msg.guild.id, tableload);
		
		return msg.channel.send('Role has been successfully set to auto assignable roles!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['aar'],
	userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'addautomaticrole',
	description: 'Adds an auto assignable role',
	usage: 'addautomaticrole {points} {rolename}',
	example: ['addautomaticrole 10 TestRole'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
