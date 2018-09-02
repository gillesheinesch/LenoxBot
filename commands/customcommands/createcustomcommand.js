exports.run = async (client, msg, args, lang) => {
	const tableload = await client.guildconfs.get(msg.guild.id);

	if (!args || args.slice().length === 0) return msg.reply(lang.createcustomcommand_noinput);
	if (args.slice(1).length === 0) return msg.reply(lang.createcustomcommand_nocommandanswer);
	if (tableload.premium.status === false && tableload.customcommands.length >= 5) return msg.reply(lang.createcustomcommand_premiumneeded);

	for (var i = 0; i < tableload.customcommands.length; i++) {
		if (tableload.customcommands[i].name.toLowerCase() === args.slice(0, 1).join(" ").toLowerCase()) return msg.reply(lang.createcustomcommand_already);
	}

	var newcommandsettings = {
		name: args.slice(0, 1).join(" ").toLowerCase(),
		creator: msg.author.id,
		commandanswer: args.slice(1).join(" "),
		descriptionOfTheCommand: '',
		embed: "false",
		commandCreatedAt: Date.now(),
		enabled: "true"
	};

	tableload.customcommands.push(newcommandsettings);
	await client.guildconfs.set(msg.guild.id, tableload);

	return msg.reply(lang.createcustomcommand_created);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "Customcommands",
	aliases: ['ccc'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'createcustomcommand',
	description: 'Creates a custom command',
	usage: 'createcustomcommand {name of the custom command} {response of the custom command}',
	example: ['createcustomcommand welcome Hello World!'],
	category: 'customcommands',
	botpermissions: ['SEND_MESSAGES']
};
