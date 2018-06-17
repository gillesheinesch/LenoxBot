const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./lenoxbot.js');
Manager.spawn(0);
