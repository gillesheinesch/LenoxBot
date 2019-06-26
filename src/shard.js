const path = require('path');
const { ShardingManager } = require('discord.js');

const ShardManager = new ShardingManager(path.resolve(__dirname, './bot.js'), {
	respawn: true,
	token: process.env.BOT_TOKEN,
	totalShards: 'auto',
	shardList: 'auto',
	delay: 15000
});

ShardManager.spawn();

ShardManager.on('shardCreate', (shard) => {
	try {
		console.log(`Successfully launched shard ${shard.id}/${ShardManager.totalShards}`);
	} catch (err) {
		console.error(err.toString());
	}
});

ShardManager.on('message', (shard,message) => {
	console.log(`Shard ${shard.id} has broadcasted the message ${message}.`);
});