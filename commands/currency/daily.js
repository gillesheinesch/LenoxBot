const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');

module.exports = class dailyCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'daily',
			group: 'currency',
			memberName: 'daily',
			description: 'Get your daily reward or give it away to another discord user',
			format: 'daily [@User]',
			aliases: ['d'],
			examples: ['daily', 'daily @Tester#3873'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'Daily',
			dashboardsettings: false,
			cooldown: 86400000
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const mentioncheck = msg.mentions.users.first();

		if (msg.client.provider.getUser(msg.author.id, 'dailyremind') === true) {
			const dailyreminder = {
				userId: msg.author.id,
				remind: Date.now() + 86400000
			};

			const currentDailyreminder = msg.client.provider.getBotsettings('botconfs', 'dailyreminder');

			currentDailyreminder[msg.author.id] = dailyreminder;
			await msg.client.provider.setBotsettings('botconfs', `dailyreminder`, currentDailyreminder);

			setTimeout(async () => {
				const currentDailyreminderTimeout = msg.client.provider.getBotsettings('botconfs', 'dailyreminder');

				delete currentDailyreminderTimeout[msg.author.id];

				await msg.client.provider.setBotsettings('botconfs', `dailyreminder`, currentDailyreminderTimeout);
				msg.author.send('Don\'t forget to pick up your daily reward');
			}, 86400000);
		}

		if (msg.client.provider.getUser(msg.author.id, 'dailystreak.lastpick') !== '') {
			if (Date.now() > msg.client.provider.getUser(msg.author.id, 'dailystreak.deadline')) {
				await msg.client.provider.setUser(msg.author.id, 'dailystreak.streak', 0);
				await msg.client.provider.setUser(msg.author.id, 'dailystreak.lastpick', '');
				await msg.client.provider.setUser(msg.author.id, 'dailystreak.deadline', '');
			}
		}

		const currentStreak = msg.client.provider.getUser(msg.author.id, 'dailystreak');
		await msg.client.provider.setUser(msg.author.id, 'dailystreak.streak', (currentStreak.streak += 1));
		await msg.client.provider.setUser(msg.author.id, 'dailystreak.lastpick', Date.now());
		await msg.client.provider.setUser(msg.author.id, 'dailystreak.deadline', (Date.now() + 172800000));


		if (!mentioncheck) {
			let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
			console.log(1111, currentCredits, typeof currentCredits);
			const currentDailystreak = msg.client.provider.getUser(msg.author.id, 'dailystreak');
			if (msg.client.provider.getUser(msg.author.id, 'premium.status') === true) {
				await msg.client.provider.setUser(msg.author.id, 'credits', (currentCredits += 400 + (currentDailystreak.streak * 2)));
			} else {
				await msg.client.provider.setUser(msg.author.id, 'credits', (currentCredits += 200 + (currentDailystreak.streak * 2)));
				console.log(432432, (currentCredits += 200 + (currentDailystreak.streak * 2)));
			}

			const author = lang.daily_author.replace('%amount', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? 200 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2) : 400 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2));
			const streak = lang.daily_streak.replace('%streak', msg.client.provider.getUser(msg.author.id, 'dailystreak').streak);

			const remindEmbed = new Discord.RichEmbed()
				.setColor('RED')
				.setAuthor(`🎁 ${author} 🎁`)
				.setDescription(`${streak} \n\n${lang.daily_remindmsg}`);
			const noRemindEmbed = new Discord.RichEmbed()
				.setColor('RED')
				.setAuthor(`🎁 ${author} 🎁`)
				.setDescription(`${streak}`);

			if (msg.client.provider.getUser(msg.author.id, 'dailyremind') === true) {
				return msg.channel.send({
					embed: remindEmbed
				});
			}
			return msg.channel.send({
				embed: noRemindEmbed
			});
		}

		let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
		const currentDailystreak = msg.client.provider.getUser(msg.author.id, 'dailystreak').streak;
		if (msg.client.provider.getUser(msg.author.id, 'premium.status') === true) {
			await msg.client.provider.setUser(mentioncheck.id, 'credits', (currentCredits += 400 + (currentDailystreak * 2)));
		} else {
			await msg.client.provider.setUser(mentioncheck.id, 'credits', (currentCredits += 200 + (currentDailystreak * 2)));
		}

		const mention = lang.daily_mention.replace('%mentiontag', mentioncheck.tag).replace('%amount', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? 200 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2) : 400 + (msg.client.provider.getUser(msg.author.id, 'dailystreak').streak * 2));
		const streak = lang.daily_streak.replace('%streak', msg.client.provider.getUser(msg.author.id, 'dailystreak').streak);

		const remindEmbed = new Discord.RichEmbed()
			.setColor('RED')
			.setAuthor(`🎁 ${mention} 🎁`)
			.setDescription(`${streak} \n\n${lang.daily_remindmsg}`);
		const noRemindEmbed = new Discord.RichEmbed()
			.setColor('RED')
			.setAuthor(`🎁 ${mention} 🎁`)
			.setDescription(`${streak}`);

		if (msg.client.provider.getUser(msg.author.id, 'dailyremind') === true) {
			return msg.channel.send({
				embed: remindEmbed
			});
		}
		return msg.channel.send({
			embed: noRemindEmbed
		});
	}
};
