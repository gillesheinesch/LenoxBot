exports.run = async (client, msg, args, lang) => {
	const tableload = await client.guildconfs.get(msg.guild.id);
	const Discord = require('discord.js');
	var arrayOfCustomCommands = [];

	if (tableload.customcommands.length === 0) return msg.reply(lang.listcustomcommand_nocustommcommands);

	const embed = new Discord.RichEmbed()
		.setColor('#ff9900');

	for (var i = 0; i < tableload.customcommands.length; i++) {
		arrayOfCustomCommands.push(`${tableload.prefix}${tableload.customcommands[i].name}`);
	}

	embed.addField(lang.listcustomcommand_embedtitle, arrayOfCustomCommands.slice(0, 15).join("\n"));

	const message = await msg.channel.send({
		embed: embed
	});

	if (arrayOfCustomCommands.length <= 15) return undefined;

	var reaction1 = await message.react('◀');
	var reaction2 = await message.react('▶');

	var first = 0;
	var second = 15;

	var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 120000
	});
	collector.on('collect', r => {
		var reactionadd = arrayOfCustomCommands.slice(first + 15, second + 15).length;
		var reactionremove = arrayOfCustomCommands.slice(first - 15, second - 15).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);

			first = first + 15;
			second = second + 15;

			const newembed = new Discord.RichEmbed()
				.setColor('#ff9900');

			newembed.addField(lang.listcustomcommand_embedtitle, arrayOfCustomCommands.slice(first, second).join("\n"), true);

			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id)

			first = first - 15;
			second = second - 15;

			const newembed = new Discord.RichEmbed()
				.setColor('#ff9900');

			newembed.addField(lang.listcustomcommand_embedtitle, arrayOfCustomCommands.slice(first, second).join("\n"), true);

			message.edit({
				embed: newembed
			});
		}
	});
	collector.on('end', (collected, reason) => {
		reaction1.remove();
		reaction2.remove();
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "Customcommands",
	aliases: ['lcc'],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'listcustomcommands',
	description: 'Lists all custom commands',
	usage: 'listcustomcommands',
	example: ['listcustomcommands'],
	category: 'customcommands',
	botpermissions: ['SEND_MESSAGES']
};
