exports.run = async(client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
	var fs = require('fs');

	const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'moderation', 'application', 'currency', 'tickets'];

	for (var i = 0; i < validation.length; i++) {
	await fs.appendFile(`gitbook/html.html`, `\n${client.commands.filter(c => c.help.category === validation[i].toLowerCase() && c.conf.enabled === true).map(cmd => `\n<tr class="table-background command ${validation[i]}">\n<td class="text h5 text-white white-border">${cmd.help.name}</td> \n<td class="text h5 text-white white-border">${cmd.help.description}</td> \n<td class="text h5 text-white white-border">${cmd.conf.userpermissions.length > 0 ? cmd.conf.userpermissions.join(", ") : 'any'}</td> \n</tr>`).join("\n")}`, function (err) {});
	}
	msg.reply('Files created/updated!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['fc'],

	

	userpermissions: [], dashboardsettings: true

};

exports.help = {
	name: 'filecreate',
	description: 'You can submit a new proposal by using this command',
	usage: 'proposal {title of the proposal} | {description}',
	example: ['proposal ping command | I want to have a ping command'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};
