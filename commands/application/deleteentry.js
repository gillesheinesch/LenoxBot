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

	if (input.length < 1) return msg.reply(lang.deleteentry_noinput);

	if (isNaN(input)) {
		for (let i = 0; i < tableload.application.template.length; i++) {
			if (input.toLowerCase() === tableload.application.template[i].toLowerCase()) {
				tableload.application.template.splice(i, 1);
				client.guildconfs.set(msg.guild.id, tableload);

				const removed = lang.deleteentry_removed.replace('%entry', `\`${input}\``);
				return msg.channel.send(removed);
			}
		}
	} else {
		tableload.application.template.splice(parseInt(input, 10) - 1, 1);
		client.guildconfs.set(msg.guild.id, tableload);

		const removed = lang.deleteentry_removed.replace('%entry', `\`${input}\``);
		return msg.channel.send(removed);
	}
	return msg.channel.send(lang.deleteentry_notexists);
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
	name: 'deleteentry',
	description: 'Deletes an entry from the template',
	usage: 'deleteentry {entry}',
	example: ['deleteentry How old are you?'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
