exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.ara) {
		tableload.ara = [];
		client.guildconfs.set(msg.guild.id, tableload);
	}

	const input = args.slice();

	if (!input[0]) return msg.reply(lang.addautomaticrole_noinput);
	if (parseInt(input[0], 10) < 0) return msg.reply(lang.addautomaticrole_inputcannotbe0);
	if (!args.slice(1).join(' ')) return msg.reply(lang.addautomaticrole_norolename);

	const roleinput = args.slice(1).join(' ');
	const foundRole = msg.guild.roles.find(role => role.name.toLowerCase() === roleinput.toLowerCase());
	if (!foundRole) return msg.reply(lang.addautomaticrole_rolenotexist);

	for (let i = 0; i < tableload.ara.length; i += 2) {
		if (foundRole.id === tableload.ara[i]) return msg.channel.send(lang.addautomaticrole_alreadyadded);
	}
	const roleId = foundRole.id;
	tableload.ara.push(roleId);
	tableload.ara.push(input[0]);
	client.guildconfs.set(msg.guild.id, tableload);

	return msg.channel.send(lang.addautomaticrole_added);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Automaticroles',
	aliases: ['aar'],
	userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
};
exports.help = {
	name: 'addautomaticrole',
	description: 'Adds an auto assignable role',
	usage: 'addautomaticrole {points} {name of the role}',
	example: ['addautomaticrole 10 TestRole'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
