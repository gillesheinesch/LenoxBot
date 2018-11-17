exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.application) {
		tableload.application = {
			reactionnumber: '',
			template: [],
			role: '',
			votechannel: '',
			archivechannel: false,
			archivechannellog: '',
			status: 'false'
		};
		client.guildconfs.set(msg.guild.id, tableload);
	}

	const input = args.slice().join(' ');

	if (input.length < 1) return msg.reply(lang.addentry_noinput);

	for (let i = 0; i < tableload.application.template.length; i++) {
		if (tableload.application.template[i].toLowerCase() === input.toLowerCase()) return msg.channel.send(lang.addentry_alreadyexists);
	}

	tableload.application.template.push(input);
	client.guildconfs.set(msg.guild.id, tableload);

	const added = lang.addentry_added.replace('%entry', `\`${input}\``);
	return msg.channel.send(added);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Entries',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'addentry',
	description: 'Inserts a new entry in the template',
	usage: 'addentry {new entry}',
	example: ['addentry How old are you?'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
