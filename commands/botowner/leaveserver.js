const settings = require('../../settings.json');
exports.run = async (client, msg, args, lang) => {
	const guildID = args.slice().join(' ');
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);
	if (!guildID || isNaN(guildID)) return msg.channel.send('You must enter a guildid. For example: `352896116812939264`');

	try {
		await client.guilds.get(args).leave();
	} catch (error) {
		return msg.reply(lang.leaveserver_nofetch);
	}

	const done = lang.leaveserver_done.replace('%guildid', guildID);
	return msg.channel.send(done);
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
	name: 'leaveserver',
	description: 'Leaves a discord server on which the bot has joined',
	usage: 'leaveserver {guildid}',
	example: ['leaveserver 8738704872894987'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
