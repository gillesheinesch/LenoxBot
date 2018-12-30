const Discord = require('discord.js');
exports.run = async client => {
	const chalk = require('chalk');
	client.user.setPresence({
		game: {
			name: `?help | www.lenoxbot.com`,
			type: 0
		}
	});

	if (client.provider.isReady) {
		console.log(chalk.green('LenoxBot is ready!'));
	} else {
		client.provider.whenReady(async () => {
			console.log(chalk.green('LenoxBot is ready!'));

			// Sets all marketitems
			const marketconfs = require('../marketitems-keys.json');
			await client.provider.setBotsettings('botconfs', 'market', marketconfs);

			// Sets the prefix for every guild
			for (let i = 0; i < client.guilds.array().length; i++) {
				if (client.provider.getGuild(client.guilds.array()[i].id, 'prefix')) {
					client.guilds.array()[i]._commandPrefix = client.provider.getGuild(client.guilds.array()[i].id, 'prefix');
				}
			}

			await client.provider.setBotsettings('botconfs', 'botstats', {
				botguildscount: client.guilds.size,
				botmemberscount: client.users.size,
				botcommands: client.provider.getBotsettings('botconfs', 'commandsexecuted'),
				botcommandsincrement: Math.floor(client.provider.getBotsettings('botconfs', 'commandsexecuted') / 170) + 1,
				botmemberscountincrement: Math.floor(client.users.size / 170) + 1,
				botguildscountincrement: Math.floor(client.guilds.size / 170) + 1
			});

			function timeoutForDaily(dailyreminder, timeoutTime) {
				setTimeout(async () => {
					client.users.get(dailyreminder.userId).send('Don\'t forget to pick up your daily reward');
					const currentDailyreminder = client.provider.getBotsettings('botconfs', 'dailyreminder');
					delete currentDailyreminder[dailyreminder.userId];
					await client.provider.setBotsettings('botconfs', 'dailyreminder', currentDailyreminder);
				}, timeoutTime);
			}

			if (typeof client.provider.getBotsettings('botconfs', 'dailyreminder') !== 'undefined') {
				if (Object.keys(client.provider.getBotsettings('botconfs', 'dailyreminder')).length !== 0) {
					/* eslint guard-for-in: 0 */
					for (const index in client.provider.getBotsettings('botconfs', 'dailyreminder')) {
						const timeoutTime = client.provider.getBotsettings('botconfs', 'dailyreminder')[index].remind - Date.now();
						console.log(client.provider.getBotsettings('botconfs', 'dailyreminder')[index]);
						timeoutForDaily(client.provider.getBotsettings('botconfs', 'dailyreminder')[index], timeoutTime);
					}
				}
			}
		});
	}

	const embed = new Discord.RichEmbed()
		.setTitle('Botrestart')
		.setDescription('LenoxBot had a restart and is back again!\nEveryone can now execute commands!')
		.setColor('#99ff66')
		.setAuthor(client.user.tag, client.user.displayAvatarURL);

	if (client.user.id === '354712333853130752') {
		client.channels.get('497400107109580801').send({
			embed
		});
	}
};

