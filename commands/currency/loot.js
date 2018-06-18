const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	var d = Math.random();
	const userdb = client.userdb.get(msg.author.id);
	const marketconfs = client.botconfs.get('market');
	const tableload = client.guildconfs.get(msg.guild.id);
	const Discord = require('discord.js');

	var inventoryslotcheck = 0;
	for (const index in userdb.inventory) {
		inventoryslotcheck = inventoryslotcheck + parseInt(userdb.inventory[index]);
	}
	const inventoryfull = lang.shop_inventoryfull.replace('%prefix', tableload.prefix);
	if (inventoryslotcheck >= userdb.inventoryslots && userdb.premium.status === false) {
		const timestamps = client.cooldowns.get('loot');
		timestamps.delete(msg.author.id);
		return msg.reply(inventoryfull);
	} else if (inventoryslotcheck + 1 >= userdb.inventoryslots && userdb.premium.status === true) {
			const timestamps = client.cooldowns.get('loot');
			timestamps.delete(msg.author.id);
			return msg.reply(inventoryfull);
	}


	const creditsloot = userdb.premium.status === false ? Math.floor(Math.random() * 70) + 1 : (Math.floor(Math.random() * 70) + 1) * 2;

	if (d < 0.005) {
		var validationfor10procent = ['house', 'car', 'diamond', 'tractor'];
		const result = Math.floor(Math.random() * validationfor10procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});

		userdb.inventory[validationfor10procent[result]] = userdb.premium.status === false ? userdb.inventory[validationfor10procent[result]] + 1 : userdb.inventory[validationfor10procent[result]] + 2;
		await client.userdb.set(msg.author.id, userdb);

		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor10procent[result]][0]} ${lang[`loot_${validationfor10procent[result]}`]} ($${marketconfs[validationfor10procent[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');
		const embed = new Discord.RichEmbed()
		.setColor('#66ff33')
		.setDescription(`🎉 ${lootmessage}`);
		return msg.channel.send({ embed });
	} else if (d < 0.05) {
		var validationfor30procent = ['phone', 'computer', 'camera', 'projector', 'bed', 'watch', 'gun'];
		const result = Math.floor(Math.random() * validationfor30procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		userdb.inventory[validationfor30procent[result]] = userdb.premium.status === false ? userdb.inventory[validationfor30procent[result]] + 1 : userdb.inventory[validationfor30procent[result]] + 2;
		await client.userdb.set(msg.author.id, userdb);

		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor30procent[result]][0]} ${lang[`loot_${validationfor30procent[result]}`]} ($${marketconfs[validationfor30procent[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');

		const embed = new Discord.RichEmbed()
		.setColor('#66ff33')
		.setDescription(`🎉 ${lootmessage}`);
		return msg.channel.send({ embed });
	} else if (d < 0.2) {
		var validationfor50procent = ['cratekey', 'pickaxe', 'joystick', 'flashlight', 'hammer', 'inventoryslotticket', 'syringe', 'gun', 'knife'];
		const result = Math.floor(Math.random() * validationfor50procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		userdb.inventory[validationfor50procent[result]] = userdb.premium.status === false ? userdb.inventory[validationfor50procent[result]] + 1 : userdb.inventory[validationfor50procent[result]] + 2;
		await client.userdb.set(msg.author.id, userdb);

		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor50procent[result]][0]} ${lang[`loot_${validationfor50procent[result]}`]} ($${marketconfs[validationfor50procent[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');

		const embed = new Discord.RichEmbed()
		.setColor('#66ff33')
		.setDescription(`🎉 ${lootmessage}`);
		return msg.channel.send({ embed });
	} else {
		var validationforrest = ['crate', 'bag', 'dog', 'cat', 'apple', 'football', 'clock', 'rose', 'umbrella', 'hamburger', 'croissant', 'basketball', 'book', 'mag', 'banana'];
		const result = Math.floor(Math.random() * validationforrest.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		userdb.inventory[validationforrest[result]] = userdb.premium.status === false ? userdb.inventory[validationforrest[result]] + 1 : userdb.inventory[validationforrest[result]] + 2;
		await client.userdb.set(msg.author.id, userdb);

		
		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationforrest[result]][0]} ${lang[`loot_${validationforrest[result]}`]} ($${marketconfs[validationforrest[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');
	
		const embed = new Discord.RichEmbed()
		.setColor('#66ff33')
		.setDescription(`🎉 ${lootmessage}`);
		return msg.channel.send({ embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['l'],

	userpermissions: [], dashboardsettings: false,

	cooldown: 600000
};
exports.help = {
	name: 'loot',
	description: 'Take your loot every 10 minutes',
	usage: 'loot',
	example: ['loot'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
