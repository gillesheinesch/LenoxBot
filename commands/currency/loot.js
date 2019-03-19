const LenoxCommand = require('../LenoxCommand.js');
const Discord = require('discord.js');
const marketitemskeys = require('../../marketitems-keys.json');

module.exports = class lootCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'loot',
			group: 'currency',
			memberName: 'loot',
			description: 'Take your loot every 10 minutes',
			format: 'loot',
			aliases: ['l'],
			examples: ['loot'],
			clientpermissions: ['SEND_MESSAGES'],
			userpermissions: [],
			shortDescription: 'Games',
			dashboardsettings: true,
			cooldown: 600000
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');

		const d = Math.random();
		const marketconfs = msg.client.provider.getBotsettings('botconfs', 'market');

		const validationfor10procent = [];
		const validationfor30procent = [];
		const validationfor50procent = [];
		const validationforrest = [];
		for (const x in marketitemskeys) {
			if (Number(marketitemskeys[x][2]) >= 1000) { // Between 1000-unlimited
				validationfor10procent.push(x);
			}
			if (Number(marketitemskeys[x][2]) >= 500 && Number(marketitemskeys[x][2]) < 1000) { // Between 500-999
				validationfor30procent.push(x);
			}
			if (Number(marketitemskeys[x][2]) >= 100 && Number(marketitemskeys[x][2]) < 500) { // Between 200-499
				validationfor50procent.push(x);
			}
			if (Number(marketitemskeys[x][2]) < 100) { // Between 0-199
				validationforrest.push(x);
			}
		}

		let inventoryslotcheck = 0;
		/* eslint guard-for-in: 0 */
		for (const index in msg.client.provider.getUser(msg.author.id, 'inventory')) {
			inventoryslotcheck += parseInt(msg.client.provider.getUser(msg.author.id, 'inventory')[index], 10);
		}
		const inventoryfull = lang.shop_inventoryfull.replace('%prefix', prefix);
		if (inventoryslotcheck >= msg.client.provider.getUser(msg.author.id, 'inventoryslots') && msg.client.provider.getUser(msg.author.id, 'premium').status === false) {
			const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
			delete timestamps.loot[msg.author.id];
			await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
			return msg.reply(inventoryfull);
		} else if (inventoryslotcheck + 1 >= msg.client.provider.getUser(msg.author.id, 'inventoryslots') && msg.client.provider.getUser(msg.author.id, 'premium').status === true) {
			const timestamps = msg.client.provider.getBotsettings('botconfs', 'cooldowns');
			delete timestamps.loot[msg.author.id];
			await msg.client.provider.setBotsettings('botconfs', 'cooldowns', timestamps);
			return msg.reply(inventoryfull);
		}


		const creditsloot = msg.client.provider.getUser(msg.author.id, 'premium').status === false ? Math.floor(Math.random() * 70) + 1 : (Math.floor(Math.random() * 70) + 1) * 2;

		if (d < 0.001) {
			const result = Math.floor(Math.random() * validationfor10procent.length);

			let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
			currentCredits += creditsloot;
			await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

			if (msg.client.provider.getUser(msg.author.id, 'premium').status === true) {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationfor10procent[result]] += 2;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			} else {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationfor10procent[result]] += 1;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			}

			const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor10procent[result]][0]} ${lang[`loot_${validationfor10procent[result]}`]} ($${marketconfs[validationfor10procent[result]][2]})`).replace('%howmany', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? '1' : '2');
			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setDescription(`🎉 ${lootmessage}`);
			msg.channel.send({
				embed
			});
		} else if (d < 0.05) {
			const result = Math.floor(Math.random() * validationfor30procent.length);

			let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
			currentCredits += creditsloot;
			await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);


			if (msg.client.provider.getUser(msg.author.id, 'premium').status === true) {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationfor30procent[result]] += 2;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			} else {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationfor30procent[result]] += 1;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			}

			const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor30procent[result]][0]} ${lang[`loot_${validationfor30procent[result]}`]} ($${marketconfs[validationfor30procent[result]][2]})`).replace('%howmany', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? '1' : '2');

			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setDescription(`🎉 ${lootmessage}`);
			msg.channel.send({
				embed
			});
		} else if (d < 0.2) {
			const result = Math.floor(Math.random() * validationfor50procent.length);

			let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
			currentCredits += creditsloot;
			await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);


			if (msg.client.provider.getUser(msg.author.id, 'premium').status === true) {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationfor50procent[result]] += 2;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			} else {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationfor50procent[result]] += 1;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			}

			const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor50procent[result]][0]} ${lang[`loot_${validationfor50procent[result]}`]} ($${marketconfs[validationfor50procent[result]][2]})`).replace('%howmany', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? '1' : '2');

			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setDescription(`🎉 ${lootmessage}`);
			msg.channel.send({
				embed
			});
		} else {
			const result = Math.floor(Math.random() * validationforrest.length);

			let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
			currentCredits += creditsloot;
			await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);


			if (msg.client.provider.getUser(msg.author.id, 'premium').status === true) {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationforrest[result]] += 2;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			} else {
				const currentItems = msg.client.provider.getUser(msg.author.id, 'inventory');
				currentItems[validationforrest[result]] += 1;
				await msg.client.provider.setUser(msg.author.id, 'inventory', currentItems);
			}

			const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationforrest[result]][0]} ${lang[`loot_${validationforrest[result]}`]} ($${marketconfs[validationforrest[result]][2]})`).replace('%howmany', msg.client.provider.getUser(msg.author.id, 'premium').status === false ? '1' : '2');

			const embed = new Discord.RichEmbed()
				.setColor('#66ff33')
				.setDescription(`🎉 ${lootmessage}`);
			msg.channel.send({
				embed
			});
		}
	}
};
