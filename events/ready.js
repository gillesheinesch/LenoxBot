exports.run = async client => {
	const chalk = require('chalk');
	client.user.setPresence({
		game: {
			name: `?help | www.lenoxbot.com`,
			type: 0
		}
	});

	if(client.provider.isReady) {
		console.log(chalk.green("LenoxBot is ready!"));
	} else {
		client.provider.whenReady(function() {
			console.log(chalk.green("LenoxBot is ready!"));
		});
	}
}