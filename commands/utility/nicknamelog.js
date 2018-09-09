const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const mention = msg.mentions.users.first() || msg.author;
	const tableload = client.guildconfs.get(msg.guild.id);
	const dateArray = [];
	const oldnickname = [];
	const newnickname = [];

	if (tableload.nicknamelog.length === 0) return msg.channel.send(lang.nicknamelog_error);

	const array = [];
	for (let i = 0; i < tableload.nicknamelog.length; i += 4) {
		if (mention.id === tableload.nicknamelog[i]) {
			array.push(true);
			oldnickname.push(tableload.nicknamelog[i + 1].length > 17 ? `${tableload.nicknamelog[i + 1].substring(0, 17)}...` : tableload.nicknamelog[i + 1]);
			newnickname.push(tableload.nicknamelog[i + 2].length > 17 ? `${tableload.nicknamelog[i + 2].substring(0, 17)}...` : tableload.nicknamelog[i + 2]);
			dateArray.push(new Date(tableload.nicknamelog[i + 3]).toLocaleString());
		}
	}

	if (array.length === 0) return msg.channel.send(lang.nicknamelog_nonicknamelog);

	const embed = new Discord.RichEmbed()
		.setAuthor(`${mention.username}#${mention.discriminator}`)
		.setColor('#ccff33')
		.addField(lang.nicknamelog_old, oldnickname.slice(0, 20).join('\n'), true)
		.addField(lang.nicknamelog_new, newnickname.slice(0, 20).join('\n'), true)
		.addField(lang.nicknamelog_changedat, dateArray.slice(0, 20).join('\n'), true);

	const message = await msg.channel.send({
		embed
	});

	await message.react('◀');
	await message.react('▶');

	let first = 0;
	let second = 20;

	const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 30000
	});
	collector.on('collect', r => {
		const reactionadd = oldnickname.slice(first + 20, second + 20).length;
		const reactionremove = oldnickname.slice(first - 20, second - 20).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			const newDateArray = dateArray.slice(first + 20, second + 20);
			const newOldNickname = oldnickname.slice(first + 20, second + 20);
			const newNewNickname = newnickname.slice(first + 20, second + 20);

			first += 20;
			second += 20;

			const newembed = new Discord.RichEmbed()
				.setAuthor(`${mention.username}#${mention.discriminator}`)
				.setColor('#ccff33')
				.addField(lang.nicknamelog_old, newOldNickname.join('\n'), true)
				.addField(lang.nicknamelog_new, newNewNickname.join('\n'), true)
				.addField(lang.nicknamelog_changedat, newDateArray.join('\n'), true);

			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			const newDateArray = dateArray.slice(first - 20, second - 20);
			const newOldNickname = oldnickname.slice(first - 20, second - 20);
			const newNewNickname = newnickname.slice(first - 20, second - 20);

			first -= 20;
			second -= 20;

			const newembed = new Discord.RichEmbed()
				.setAuthor(`${mention.username}#${mention.discriminator}`)
				.setColor('#ccff33')
				.addField(lang.nicknamelog_old, newOldNickname.join('\n'), true)
				.addField(lang.nicknamelog_new, newNewNickname.join('\n'), true)
				.addField(lang.nicknamelog_changedat, newDateArray.join('\n'), true);

			message.edit({
				embed: newembed
			});
		}
	});
	collector.on('end', () => {
		message.react('❌');
	});
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
	name: 'nicknamelog',
	description: 'Shows you the nickname log of you or a user',
	usage: 'nicknamelog [@User]',
	example: ['nicknamelog', 'nicknamelog @Monkeyyy11#7584'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
