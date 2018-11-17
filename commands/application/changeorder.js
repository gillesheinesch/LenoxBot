exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const firstNumber = args.slice(0, 1);
	const secondNumber = args.slice(1, 2);

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

	if (firstNumber.length === 0 || secondNumber.length === 0) return msg.reply(lang.entrychangeorder_error);
	if (isNaN(firstNumber) || isNaN(secondNumber)) return msg.reply(lang.entrychangeorder_notcorrectused);
	if (firstNumber === secondNumber) return msg.reply(lang.entrychangeorder_same);
	if (typeof tableload.application.template[Number(firstNumber) - 1] === 'undefined' || typeof tableload.application.template[Number(secondNumber) - 1] === 'undefined') return msg.reply(lang.entrychangeorder_undefined);

	const firstEntry = tableload.application.template[Number(firstNumber) - 1];
	const secondEntry = tableload.application.template[Number(secondNumber) - 1];

	tableload.application.template[Number(secondNumber) - 1] = firstEntry;
	tableload.application.template[Number(firstNumber) - 1] = secondEntry;

	client.guildconfs.set(msg.guild.id, tableload);

	msg.reply(lang.entrychangeorder_set);
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
	name: 'changeorder',
	description: 'Changes the order of application entries',
	usage: 'changeorder {first application entry ID} {second application entry ID}',
	example: ['changeorder 1 2', 'changeorder 3 1'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
