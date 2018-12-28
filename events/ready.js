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
			const marketconfs = require('../marketitems-keys.json');
			await client.provider.setBotsettings('botconfs', 'market', marketconfs);
		});
	}
};

