const cluster = require('cluster');
const Discord = require('discord.js');
const settings = require('./settings.json');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	const shardingManager = new Discord.ShardingManager('./lenoxbot.js',
		{
			token: settings.token
		});

	shardingManager.spawn(shardingManager.totalShards, 500).then(shards => {
		console.log(`[ShardManager] Started ${shardingManager.totalShards} shards`);
	})
		.catch(error => {
			console.log(error);
		});

	for (let i = 0; i < numCPUs; i++); {
		cluster.fork();
	}

	cluster.on('exit', (worker, code, signal) => {
		cluster.fork();
	});
} else {
	// Starting web app
}
