const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class warnlogCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'warnlog',
			group: 'moderation',
			memberName: 'warnlog',
			description: 'Shows you the warnlog from you or a user',
			format: 'warnlog [@User]',
			aliases: ['wl', 'warns'],
			examples: ['warnlog', 'warnlog @Monkeyyy11#7584'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['KICK_MEMBERS'],
			shortDescription: 'Warn',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const mention = msg.mentions.users.first() || msg.author;

		if (msg.client.provider.getGuild(msg.message.guild.id, 'warnlog').length === 0) return msg.channel.send(lang.warnlog_error);

		const firstfield = [];
		const secondfield = [];

		const array = [];
		for (let i = 0; i < msg.client.provider.getGuild(msg.message.guild.id, 'warnlog').length; i += 4) {
			if (mention.id === msg.client.provider.getGuild(msg.message.guild.id, 'warnlog')[i]) {
				array.push(true);
				const member = msg.guild.member(msg.client.provider.getGuild(msg.message.guild.id, 'warnlog')[i + 3]) ? msg.guild.member(msg.client.provider.getGuild(msg.message.guild.id, 'warnlog')[i + 3]).user.tag : msg.client.provider.getGuild(msg.message.guild.id, 'warnlog')[i + 3];

				const warnedbyandon = lang.warnlog_warnedbyandon.replace('%membername', member).replace('%date', new Date(msg.client.provider.getGuild(msg.message.guild.id, 'warnlog')[i + 1]).toUTCString());
				firstfield.push(warnedbyandon);
				secondfield.push(msg.client.provider.getGuild(msg.message.guild.id, 'warnlog')[i + 2]);
			}
		}

		if (array.length === 0) return msg.channel.send(lang.warnlog_notwarned);

		const embed = new Discord.RichEmbed()
			.setColor('#fff024')
			.setAuthor(mention.tag, mention.displayAvatarURL);

		const x = firstfield.slice(0, 5);
		const xx = secondfield.slice(0, 5);

		for (let i = 0; i < x.length; i++) {
			embed.addField(x[i], xx[i]);
		}

		const message = await msg.channel.send({ embed });

		await message.react('◀');
		await message.react('▶');

		let first = 0;
		let second = 5;

		const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 30000
		});
		collector.on('collect', r => {
			const reactionadd = firstfield.slice(first + 5, second + 5).length;
			const reactionremove = firstfield.slice(first - 5, second - 5).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				const thefirst = firstfield.slice(first + 5, second + 5);
				const thesecond = secondfield.slice(first + 5, second + 5);

				first += 5;
				second += 5;

				const newembed = new Discord.RichEmbed()
					.setColor('#fff024')
					.setAuthor(mention.tag, mention.displayAvatarURL);

				for (let i = 0; i < thefirst.length; i++) {
					newembed.addField(thefirst[i], thesecond[i]);
				}

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				const thefirst = firstfield.slice(first - 5, second - 5);
				const thesecond = secondfield.slice(first - 5, second - 5);

				first -= 5;
				second -= 5;

				const newembed = new Discord.RichEmbed()
					.setColor('#fff024')
					.setAuthor(mention.tag, mention.displayAvatarURL);

				for (let i = 0; i < thefirst.length; i++) {
					newembed.addField(thefirst[i], thesecond[i]);
				}

				message.edit({
					embed: newembed
				});
			}
		});
		collector.on('end', () => {
			message.react('❌');
		});
	}
};
