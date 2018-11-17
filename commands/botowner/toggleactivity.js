const settings = require('../../settings.json');
exports.run = (client, msg, args, lang) => {
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

	const tableload = client.botconfs.get('botconfs');
	const channelId = msg.channel.id;

	if (tableload.activity === false) {
		tableload.activity = true;
		tableload.activitychannel = channelId;

		const set = lang.toggleactivity_set.replace('%channelname', `#${msg.channel.name}`);
		msg.channel.send(set);
	} else {
		tableload.activity = false;

		const unset = lang.toggleactivity_unset.replace('%channelname', `#${msg.channel.name}`);
		msg.channel.send(unset);
	}

	client.botconfs.set('botconfs', tableload);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'toggleactivity',
	description: 'Shows the current bot usage',
	usage: 'toggleactivity',
	example: ['toggleactivity'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
