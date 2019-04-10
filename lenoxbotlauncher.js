const Discord = require('discord.js');
const settings = require('./settings.json');
const chalk = require('chalk');

const shardingManager = new Discord.ShardingManager('./lenoxbot.js',
	{
		token: settings.token
	});

shardingManager.spawn(shardingManager.totalShards, 15000).then(() => {
	console.log(chalk.green(`[ShardManager] Started ${shardingManager.totalShards} shards`));
}).catch(error => {
	console.log(error);
});

const express = require('express');
const app = express();

function authorizationCodeCheck(authorizationcode, res) {
	if (settings.apitoken !== authorizationcode) {
		return false;
	}
	return true;
}

// get all todos
app.get('/api/v1/:authorizationcode/islenoxbotondiscordserver/:guildid', async (req, res) => {
	const check = authorizationCodeCheck(req.params.authorizationcode, res);
	if (!check) {
		return res.status(401).send({
			success: 'false',
			message: 'Unauthorized: Token invalid'
		});
	}

	const result = await shardingManager.broadcastEval(`this.guilds.get('${req.params.guildid}')`);

	if (result && typeof result[0] !== 'undefined') {
		res.status(200).send({
			success: 'true',
			message: 'Guild found',
			content: result
		});
	} else {
		res.status(404).send({
			success: 'false',
			message: 'Guild not found'
		});
	}
});

const PORT = 8080;

app.listen(PORT, () => {
	console.log(`API running on port ${settings.websiteport}`);
});
