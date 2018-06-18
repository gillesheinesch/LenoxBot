const Discord = require('discord.js');
const ms = require('ms');
exports.run = async(client, msg, args, lang) => {
	const mention = msg.mentions.members.first() || msg.author;
	const tableload = client.guildconfs.get(msg.guild.id);
	let dateArray = [];
	let oldnickname = [];
	let newnickname = [];

	if (tableload.nicknamelog.length === 0) return msg.channel.send(lang.nicknamelog_error);

	const array = [];
	for (var i = 0; i < tableload.nicknamelog.length; i += 4) {
		if (mention.id === tableload.nicknamelog[i]) {
			array.push(true);
			oldnickname.push(tableload.nicknamelog[i + 1].length > 17 ? tableload.nicknamelog[i + 1].substring(0, 17) + "..." : tableload.nicknamelog[i + 1]);
			newnickname.push(tableload.nicknamelog[i + 2].length > 17 ? tableload.nicknamelog[i + 2].substring(0, 17) + "..." : tableload.nicknamelog[i + 2]);
			dateArray.push(new Date(tableload.nicknamelog[i + 3]).toLocaleString());
		}
	}

	if (array.length === 0) return msg.channel.send(lang.nicknamelog_nonicknamelog);

	let embed = new Discord.RichEmbed()
		.setAuthor(`${mention.username}#${mention.discriminator}`)
		.setColor('#ccff33')
		.addField(lang.nicknamelog_old, oldnickname.slice(0, 20).join('\n'), true)
		.addField(lang.nicknamelog_new, newnickname.slice(0, 20).join('\n'), true)
		.addField(lang.nicknamelog_changedat, dateArray.slice(0, 20).join('\n'), true);

	const message = await msg.channel.send({ embed });

	await message.react('◀');
	await message.react('▶');

	var first = 0;
	var second = 20;

	var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 30000
	});
	collector.on('collect', r => {
		var reactionadd = nickname.slice(first + 20, second + 20).length;
		var reactionremove = nickname.slice(first - 20, second - 20).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			const thefirst = dateArray.slice(first + 20, second + 20);
			const thesecond = nickname.slice(first + 20, second + 20);

			first = first + 20;
			second = second + 20;

		const newembed = new Discord.RichEmbed()
		.setAuthor(`${mention.username}#${mention.discriminator}`)
		.setColor('#ccff33')
		.addField('Nickname', nickname.join('\n'), true)
		.addField('Changed at', dateArray.join('\n'), true);

			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			const thefirst = tempArray.slice(first - 20, second - 20);
			const thesecond = dateArray.slice(first - 20, second - 20);

			first = first - 20;
			second = second - 20;

			const newembed = new Discord.RichEmbed()
		.setAuthor(`${mention.username}#${mention.discriminator}`)
		.setColor('#ccff33')
		.addField('Nickname', nickname.join('\n'), true)
		.addField('Changed at', dateArray.join('\n'), true);

			message.edit({
				embed: newembed
			});
		}
	});
	collector.on('end', (collected, reason) => {
		message.react('❌');
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
	userpermissions: []
=======
	userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'nicknamelog',
	description: 'Shows you the nickname log of you or a user',
	usage: 'nicknamelog [@User]',
	example: ['nicknamelog', 'nicknamelog @Monkeyyy11#7584'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
