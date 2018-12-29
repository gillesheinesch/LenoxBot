const Commando = require('discord.js-commando');
const fs = require('fs');
const LenoxBotSettingsProvider = require('./utils/SettingsProvider');
const settings = require('./settings.json');
const path = require('path');
const chalk = require('chalk');
const englishlang = require(`./languages/en-US.json`);

if (process.env.SHARD_COUNT) {
	// const shardId = process.env.SHARD_COUNT;
	const token = process.env.CLIENT_TOKEN;


	if (!settings.token || settings.token === '' || !settings.prefix || settings.prefix === '' || !settings.sqlitefilename || settings.sqlitefilename === '' || !settings.owners || settings.owners.length === 0 || !settings.keychannel || settings.keychannel === '' || !settings.websiteport || isNaN(settings.websiteport)) {
		console.error(chalk.red('\nsettings.json file is not correctly configuered!\n'));
		return process.exit(42);
	}


	const client = new Commando.Client({
		owner: settings.owners,
		commandPrefix: '?',
		invite: 'discord.gg/jmZZQja',
		unknownCommandResponse: false,
		nonCommandEditable: false
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
		.registerDefaultTypes()
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
		.registerCommandsIn(path.join(__dirname, 'commands'));


	client.dispatcher.addInhibitor(msg => {
		if (msg.author.bot) return undefined;
		if (msg.channel.type !== 'text') return msg.reply(englishlang.messageevent_error);
		if (!client.provider.isReady) return undefined;

		if (client.user.id === '353115097318555649') {
			if (msg.guild.id !== '332612123492483094') return undefined;
		}
	});
} else {
	console.log(chalk.red('Stopped process because the bot isn\'t running as a shard! Please start lenoxbotlauncher.js to support sharding.'));
	process.exit(0);
}
