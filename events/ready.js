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
		});
	}
};

