const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
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

	if (tableload.application.template.length === 0) return msg.reply(lang.listentry_error);

	const templates = [];

	for (let i = 0; i < tableload.application.template.length; i++) {
		templates.push(`\`${i + 1}.\` ${tableload.application.template[i]}`);
	}

	const embed = new Discord.RichEmbed()
		.setColor('#ABCDEF');
	embed.addField(lang.listentry_current, templates.slice(0, 10).join('\n'), true);
	const message = await msg.channel.send({
		embed: embed
	});

	if (templates.length <= 10) return;
	const reaction1 = await message.react('◀');
	const reaction2 = await message.react('▶');

	let first = 0;
	let second = 10;

	const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 120000
	});
	collector.on('collect', r => {
		const reactionadd = templates.slice(first + 10, second + 10).length;
		const reactionremove = templates.slice(first - 10, second - 10).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);

			first += 10;
			second += 10;

			const newembed = new Discord.RichEmbed()
				.setColor('#ABCDEF');

			newembed.addField(lang.listentry_current, templates.slice(first, second).join('\n'), true);

			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id);

			first -= 10;
			second -= 10;

			const newembed = new Discord.RichEmbed()
				.setColor('#ABCDEF');

			newembed.addField(lang.listentry_current, templates.slice(first, second).join('\n'), true);

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
	shortDescription: 'Entries',
	aliases: [],
	userpermissions: ['ADMINISTRATOR'],
	dashboardsettings: true
};
exports.help = {
	name: 'listentry',
	description: 'Shows all entries that exist in the template',
	usage: 'listentry',
	example: ['listentry'],
	category: 'application',
	botpermissions: ['SEND_MESSAGES']
};
