const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const fs = require('fs');
const mongodb = require('mongodb');
const LenoxBotSettingsProvider = require('./utils/SettingsProvider');
const settings = require('./settings.json');
const path = require('path');
const chalk = require('chalk');

if (process.env.SHARD_COUNT) {
	const shardId = process.env.SHARD_COUNT;
	const token = process.env.CLIENT_TOKEN;


	if (!settings.token || settings.token === '' || !settings.prefix || settings.prefix === '' || !settings.sqlitefilename || settings.sqlitefilename === '' || !settings.owners || settings.owners.length === 0 || !settings.keychannel || settings.keychannel === '' || !settings.websiteport || isNaN(settings.websiteport)) {
		console.error(chalk.red('\nsettings.json file is not correctly configuered!\n'));
		return process.exit(42);
	}


	const client = new Commando.Client({
		owner: settings.owners,
		commandPrefix: '?'
	});

	fs.readdir('./events/', (err, files) => {
		if (err) return console.error(err);
		files.forEach(file => {
			const eventFunction = require(`./events/${file}`);
			const eventName = file.split('.')[0];
			client.on(eventName, (...args) => eventFunction.run(client, ...args));
		});
	});

	client.setProvider(new LenoxBotSettingsProvider(settings));
	client.login(token);

	client.registry
		.registerGroups([
			['administration', 'Administration'],
			['application', 'Application'],
			['botowner', 'Bot Owner only'],
			['currency', 'Currency'],
			['customcommands', 'CustomCommands'],
			['fun', 'Fun'],
			['help', 'Help'],
			['moderation', 'Moderation'],
			['music', 'Music'],
			['nsfw', 'NSFW'],
			['partner', 'Partner'],
			['searches', 'Searches'],
			['staff', 'Staff'],
			['tickets', 'Tickets'],
			['utility', 'Utility']
		])
		.registerDefaults()
		.registerCommandsIn(path.join(__dirname, 'commands'));
} else {
	console.log('Not running as a shard.');
	process.exit(0);
}
