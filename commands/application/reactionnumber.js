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


	const number = args.slice();

	const current = lang.reactionnumber_current.replace('%reactionnumber', tableload.reactionnumber);
	if (number.length === 0 && tableload.application.reactionnumber !== '') return msg.channel.send(current);

	if (number.length > 1) return msg.channel.send(lang.reactionnumber_error);
	if (isNaN(number)) return msg.channel.send(lang.reactionnumber_noinput);
	if (number < 2) return msg.channel.send(lang.reactionnumber_cannotbe0orless);

	tableload.application.reactionnumber = number;
	client.guildconfs.set(msg.guild.id, tableload);

	const changed = lang.reactionnumber_changed.replace('%newreactionnumber', number);
	msg.channel.send(changed);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Settings',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'reactionnumber',
	description: 'Defines the number of reactions required to accept or reject an application',
	usage: 'reactionnumber {number}',
	example: ['reactionnumber 2'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
