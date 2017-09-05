const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;
const fs = require('fs');
const Enmap = require('enmap');
client.guildconfs = new Enmap({ name: 'guildsettings', persistent: true });
client.botconfs = new Enmap({ name: 'botconfs', persistent: true });

fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		let eventFunction = require(`./events/${file}`);
		let eventName = file.split('.')[0];
		client.on(eventName, (...args) => eventFunction.run(client, ...args));
	});
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir(`./commands/`, (err, files) => {
	if (err) console.error(err);
	files.forEach(f => {
		let props = require(`./commands/${f}`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
});

client.login(token);

