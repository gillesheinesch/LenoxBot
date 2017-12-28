const Discord = require('discord.js');
exports.run = async(client, msg, args) => {
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
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	const embed = new Discord.RichEmbed()
	.setColor('0066CC')
	.setAuthor(`All active/disabled modules!`);

	var disabledmodules = [];
	var activatedmodules = [];

	for (var i in tableload.modules) {
		if (tableload.modules[i] === 'false') {
			disabledmodules.push(i);
		} else {
			activatedmodules.push(i);
		}
	}

	embed.addField('Active modules', activatedmodules.length !== 0 ? activatedmodules.join("\n") : 'No modules activated');
	embed.addField('Disabled modules', disabledmodules.length !== 0 ? disabledmodules.join("\n") : 'No modules disabled');

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['lm'],
	userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'listmodules',
	description: 'Lists all active/disabled modules',
	usage: 'listmodules',
	example: ['listmodules'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};
