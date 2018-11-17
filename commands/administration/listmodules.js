const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);

	if (!tableload.modules) {
		tableload.modules = {};
		tableload.modules.fun = 'true';
		tableload.modules.help = 'true';
		tableload.modules.moderation = 'true';
		tableload.modules.music = 'true';
		tableload.modules.nsfw = 'true';
		tableload.modules.searches = 'true';
		tableload.modules.utility = 'true';
		tableload.modules.application = 'true';
		tableload.modules.tickets = 'true';
		tableload.modules.currency = 'true';
		client.guildconfs.set(msg.guild.id, tableload);
	}

	const embed = new Discord.RichEmbed()
		.setColor('0066CC')
		.setAuthor(lang.listmodules_embed);

	const disabledmodules = [];
	const activatedmodules = [];

	for (const i in tableload.modules) {
		if (tableload.modules[i] === 'false') {
			disabledmodules.push(i);
		} else {
			activatedmodules.push(i);
		}
	}

	embed.addField(lang.listmodules_activemodules, activatedmodules.length === 0 ? lang.listmodules_noactivemodules : activatedmodules.join('\n'));
	embed.addField(lang.listmodules_disabledmodules, disabledmodules.length === 0 ? lang.listmodules_nodisabledmodules : disabledmodules.join('\n'));

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Modules',
	aliases: ['lm'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'listmodules',
	description: 'Lists all active/disabled modules',
	usage: 'listmodules',
	example: ['listmodules'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
