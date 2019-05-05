const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
const ms = require('ms');

module.exports = class punishmentsCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'punishments',
			group: 'moderation',
			memberName: 'punishments',
			description: 'Shows you the punishments from a user',
			format: 'punishments {@User/UserID}',
			aliases: ['p'],
			examples: ['punishments', 'punishments @Monkeyyy11#7584', 'punishments 238590234135101440'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: ['KICK_MEMBERS'],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const args = msg.content.split(' ').slice(1);

		moment.locale(msg.client.provider.getGuild(msg.guild.id, 'momentLanguage'));

		let user = msg.mentions.users.first();

		if (!user && (!args || args.length === 0)) return msg.reply('No user mention or userid');

		if (!user) {
			try {
				const fetchedMember = await msg.guild.members.fetch(args.slice(0, 1).join(' '));
				if (!fetchedMember) throw new Error('User not found!');
				user = fetchedMember;
				user = user.user;
			} catch (error) {
				return msg.reply('User not found');
			}
		}

		if (msg.client.provider.getGuild(msg.guild.id, 'punishments').length === 0) return msg.channel.send(lang.punishments_error);

		const currentPunishments = msg.client.provider.getGuild(msg.guild.id, 'punishments');
		let punishmentsArrayOfTheUser = [];
		for (let i = 0; i < currentPunishments.length; i++) {
			if (user.id === currentPunishments[i].userId) {
				const moderator = msg.guild.member(currentPunishments[i].moderatorId) ? msg.guild.member(currentPunishments[i].moderatorId).user.tag : currentPunishments[i].moderatorId;

				const punishmentObject = {};
				punishmentObject.title = lang[`punishments_${currentPunishments[i].type}`].replace('%moderator', moderator).replace('%date', moment(currentPunishments[i].date).format('MMMM Do YYYY, h:mm:ss a')).replace('%bantime', currentPunishments[i].bantime ? ms(Number(currentPunishments[i].bantime)) : 'undefined')
					.replace('%mutetime', currentPunishments[i].mutetime ? ms(Number(currentPunishments[i].mutetime)) : 'undefined');
				punishmentObject.description = lang.punishments_reason.replace('%reason', currentPunishments[i].reason);

				punishmentsArrayOfTheUser.push(punishmentObject);
			}
		}
		if (punishmentsArrayOfTheUser.length === 0) return msg.channel.send(lang.punishments_notpunished);

		punishmentsArrayOfTheUser = punishmentsArrayOfTheUser.reverse();

		const embed = new Discord.MessageEmbed()
			.setColor('#fff024')
			.setAuthor(user.tag, user.displayAvatarURL());

		const embedFields = punishmentsArrayOfTheUser.slice(0, 5);

		for (let i = 0; i < embedFields.length; i++) {
			embed.addField(embedFields[i].title, embedFields[i].description);
		}

		const message = await msg.channel.send({ embed });

		if (punishmentsArrayOfTheUser.length <= 5) return undefined;

		const reaction1 = await message.react('◀');
		const reaction2 = await message.react('▶');

		let first = 0;
		let second = 5;

		const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 30000
		});
		collector.on('collect', r => {
			const reactionadd = punishmentsArrayOfTheUser.slice(first + 5, second + 5).length;
			const reactionremove = punishmentsArrayOfTheUser.slice(first - 5, second - 5).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.users.remove(msg.author.id);
				const thefirst = punishmentsArrayOfTheUser.slice(first + 5, second + 5);

				first += 5;
				second += 5;

				const newembed = new Discord.MessageEmbed()
					.setColor('#fff024')
					.setAuthor(user.tag, user.displayAvatarURL());

				for (let i = 0; i < thefirst.length; i++) {
					newembed.addField(thefirst[i].title, thefirst[i].description);
				}

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.users.remove(msg.author.id);
				const thefirst = punishmentsArrayOfTheUser.slice(first - 5, second - 5);

				first -= 5;
				second -= 5;

				const newembed = new Discord.MessageEmbed()
					.setColor('#fff024')
					.setAuthor(user.tag, user.displayAvatarURL());

				for (let i = 0; i < thefirst.length; i++) {
					newembed.addField(thefirst[i].title, thefirst[i].description);
				}

				message.edit({
					embed: newembed
				});
			}
		});
		collector.on('end', () => {
			reaction1.users.remove();
			reaction2.users.remove();
		});
	}
};
