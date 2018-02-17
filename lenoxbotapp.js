const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./settings.json').token;
const fs = require('fs');
const Enmap = require('enmap');
const NewsAPI = require('newsapi');
const Trello = require("trello");
const EnmapLevel = require('enmap-level');

client.wait = require("util").promisify(setTimeout);
client.guildconfs = new Enmap({ provider: new EnmapLevel({ name: 'guildsettings' }) });
client.botconfs = new Enmap({ provider: new EnmapLevel({ name: 'botconfs' }) });
client.starboard = new Enmap({ provider: new EnmapLevel({ name: 'starboard' }) });
client.redeem = new Enmap({ provider: new EnmapLevel({ name: 'redeem' }) });
client.userdb = new Enmap({ provider: new EnmapLevel({ name: 'userdb' }) });
client.queue = new Map();
client.skipvote = new Map();
client.newsapi = new NewsAPI('351893454fd1480ea4fe2f0eac0307c2');
client.trello = new Trello("b5b98adeec332e10639db5473c96c42d", "264056f59d9a13dad78afd5cc2f960c5b410510b142813811bd96788d5687f4c");
client.cooldowns = new Discord.Collection();

const DBL = require("dblapi.js");
client.dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NDcxMjMzMzg1MzEzMDc1MiIsImJvdCI6dHJ1ZSwiaWF0IjoxNTA5NjU3MTkzfQ.dDleV67s0ESxSVUxKxeQ8W_z6n9YwrDrF9ObU2MKgVE');
client.dbl.getVotes(true);


fs.readdir('./events/', (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		let eventFunction = require(`./events/${file}`);
		let eventName = file.split('.')[0];
		client.on(eventName, (...args) => eventFunction.run(client, ...args));
	});
});

/*
process.on('unhandledRejection', (reason) => {
	if (reason.name === 'DiscordAPIError') return;
	console.error(reason);
});
process.on('uncaughtException', (reason) => {
	console.error(reason);
});
*/

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const categories = ['partner', 'currency', 'botowner', 'administration', 'moderation', 'fun', 'help', 'music', 'nsfw', 'searches', 'trello', 'utility', 'staff', 'application'];
categories.forEach((c, i) => {
	fs.readdir(`./commands/${c}/`, (err, files) => {
	  if (err) throw err;
	  console.log(`[Commands] Loading ${files.length} commands... (category: ${c})`);
  
	  files.forEach((f) => {
		let props = require(`./commands/${c}/${f}`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
	});
});

client.login(token);

