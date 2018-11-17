exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const firstNumber = args.slice(0, 1);
	const newEntryText = args.slice(1);

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

	if (firstNumber.length === 0) return msg.reply(lang.editentry_noid);
	if (newEntryText.length === 0) return msg.reply(lang.editentry_noentrytext);
	if (isNaN(firstNumber)) return msg.reply(lang.editentry_noid);
	if (typeof tableload.application.template[Number(firstNumber) - 1] === 'undefined') return msg.reply(lang.editentry_undefined);

	tableload.application.template[Number(firstNumber) - 1] = newEntryText.join(' ');

	client.guildconfs.set(msg.guild.id, tableload);

	const set = lang.editentry_set.replace('%id', firstNumber);
	msg.reply(set);
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
	name: 'editentry',
	description: 'Edits an application entry text',
	usage: 'editentry {application entry ID} {new application entry text}',
	example: ['editentry 1 Hello dear applicant'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
