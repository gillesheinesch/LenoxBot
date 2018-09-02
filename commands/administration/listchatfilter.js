const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const array = [];

	if (!tableload.chatfilter) {
		tableload.chatfilter = {
			chatfilter: 'false',
			array: []
		};
		await client.guildconfs.set(msg.guild.id, tableload);
	}

	if (tableload.chatfilter.array.length === 0) return msg.channel.send(lang.listchatfilter_error);

	const embed = new Discord.RichEmbed()
		.setColor('#ABCDEF');

	for (var i = 0; i < tableload.chatfilter.array.length; i++) {
		array.push(tableload.chatfilter.array[i]);
	}

	embed.addField(lang.listchatfilter_embed, array.slice(0, 15).join("\n"), true);

	const message = await msg.channel.send({
		embed: embed
	});

	if (array.length > 15) {
		var reaction1 = await message.react('◀');
		var reaction2 = await message.react('▶');

		var first = 0;
		var second = 15;

		var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 120000
		});
		collector.on('collect', r => {
			var reactionadd = array.slice(first + 15, second + 15).length;
			var reactionremove = array.slice(first - 15, second - 15).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.remove(msg.author.id);

				first = first + 15;
				second = second + 15;

				const newembed = new Discord.RichEmbed()
					.setColor('#ABCDEF');

				newembed.addField(lang.listchatfilter_embed, array.slice(first, second).join("\n"), true);

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.remove(msg.author.id)

				first = first - 15;
				second = second - 15;

				const newembed = new Discord.RichEmbed()
					.setColor('#ABCDEF');

				newembed.addField(lang.listchatfilter_embed, array.slice(first, second).join("\n"), true);

				message.edit({
					embed: newembed
				});
			}
		});
		collector.on('end', (collected, reason) => {
			reaction1.remove();
			reaction2.remove();
		});
	} else {
		return undefined;
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "Chatfilter",
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'listchatfilter',
	description: 'Lists all chat filter entries',
	usage: 'listchatfilter',
	example: ['listchatfilter'],
	category: 'administration',
	botpermissions: ['SEND_MESSAGES']
};