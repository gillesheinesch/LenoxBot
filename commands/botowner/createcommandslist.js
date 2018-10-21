const settings = require('../../settings.json');
exports.run = async (client, msg, args, lang) => {
	if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);
	const fs = require('fs');

	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application', 'currency', 'tickets'];

	for (let i = 0; i < validation.length; i++) {
		await fs.appendFile(`commands.md`, `---${validation[i]}---\n\n${client.commands.filter(c => c.help.category === validation[i].toLowerCase() && c.conf.enabled === true).map(cmd => `* \`${cmd.help.usage}\` - ${lang[`${cmd.help.name}_description`]} (Needed permissions: ${cmd.conf.userpermissions.length > 0 ? cmd.conf.userpermissions.join(', ') : 'none'})`).join('\n')}\n\n`);
	}
	msg.reply(lang.createcommandlist_done);
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
	name: 'createcommandslist',
	description: 'Creates a list of all commands in Markdown (.md) format',
	usage: 'createcommandslist',
	example: ['createcommandslist'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
