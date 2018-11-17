exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const Discord = require('discord.js');
	const arrayOfCustomCommands = [];

	if (tableload.customcommands.length === 0) return msg.reply(lang.listcustomcommands_nocustommcommands);

	const embed = new Discord.RichEmbed()
		.setColor('#ff9900');

	for (let i = 0; i < tableload.customcommands.length; i++) {
		arrayOfCustomCommands.push(`${tableload.prefix}${tableload.customcommands[i].name}`);
	}

	embed.addField(lang.listcustomcommands_embedtitle, arrayOfCustomCommands.slice(0, 15).join('\n'));

	const message = await msg.channel.send({
		embed: embed
	});

	if (arrayOfCustomCommands.length <= 15) return;

	const reaction1 = await message.react('◀');
	const reaction2 = await message.react('▶');

	let first = 0;
	let second = 15;

	const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 120000
	});
	collector.on('collect', r => {
		const reactionadd = arrayOfCustomCommands.slice(first + 15, second + 15).length;
		const reactionremove = arrayOfCustomCommands.slice(first - 15, second - 15).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);

			first += 15;
			second += 15;

			const newembed = new Discord.RichEmbed()
				.setColor('#ff9900');

			newembed.addField(lang.listcustomcommands_embedtitle, arrayOfCustomCommands.slice(first, second).join('\n'), true);

			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id);

			first -= 15;
			second -= 15;

			const newembed = new Discord.RichEmbed()
				.setColor('#ff9900');

			newembed.addField(lang.listcustomcommands_embedtitle, arrayOfCustomCommands.slice(first, second).join('\n'), true);

			message.edit({
				embed: newembed
			});
		}
	});
	collector.on('end', () => {
		reaction1.remove();
		reaction2.remove();
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Customcommands',
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
