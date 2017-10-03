const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;
const fs = require('fs');
const Enmap = require('enmap');
const NewsAPI = require('newsapi');
client.wait = require("util").promisify(setTimeout);
client.guildconfs = new Enmap({ name: 'guildsettings', persistent: true });
client.botconfs = new Enmap({ name: 'botconfs', persistent: true });
client.starboard = new Enmap({ name: 'starboard', persistent: true });
client.queue = new Map();
client.skipvote = new Map();
client.newsapi = new NewsAPI('351893454fd1480ea4fe2f0eac0307c2');

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

