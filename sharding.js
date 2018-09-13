// Not used yet!!
const {
	ShardingManager
} = require('discord.js');
const settings = require('./settings.json');
const manager = new ShardingManager('./lenoxbotapp.js', {
	token: settings.token
});

manager.spawn();
manager.on('launch', shard => console.log(`Launched shard ${shard.id}`));
// Not used yet!!
