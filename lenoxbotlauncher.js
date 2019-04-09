const Discord = require('discord.js');
const settings = require('./settings.json');
const chalk = require('chalk');

const userdb = new Map();
const shardingManager = new Discord.ShardingManager('./lenoxbot.js',
	{
		token: settings.token
	});

shardingManager.spawn(shardingManager.totalShards, 15000).then(() => {
	console.log(chalk.green(`[ShardManager] Started ${shardingManager.totalShards} shards`));
}).catch(error => {
	console.log(error);
});
