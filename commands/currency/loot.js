const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
const Discord = require('discord.js');
const marketitemskeys = require('../../marketitems-keys.json');
exports.run = (client, msg, args, lang) => {
	const d = Math.random();
	const userdb = client.userdb.get(msg.author.id);
	const marketconfs = client.botconfs.get('market');
	const tableload = client.guildconfs.get(msg.guild.id);

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
	for (const index in userdb.inventory) {
		inventoryslotcheck += parseInt(userdb.inventory[index], 10);
	}
	const inventoryfull = lang.shop_inventoryfull.replace('%prefix', tableload.prefix);
	if (inventoryslotcheck >= userdb.inventoryslots && userdb.premium.status === false) {
		const timestamps = client.cooldowns.get('loot');
		delete timestamps[msg.author.id];
		client.cooldowns.set('loot', timestamps);
		return msg.reply(inventoryfull);
	} else if (inventoryslotcheck + 1 >= userdb.inventoryslots && userdb.premium.status === true) {
		const timestamps = client.cooldowns.get('loot');
		delete timestamps[msg.author.id];
		client.cooldowns.set('loot', timestamps);
		return msg.reply(inventoryfull);
	}


	const creditsloot = userdb.premium.status === false ? Math.floor(Math.random() * 70) + 1 : (Math.floor(Math.random() * 70) + 1) * 2;

	if (d < 0.001) {
		const result = Math.floor(Math.random() * validationfor10procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});

		if (userdb.premium.status === true) {
			userdb.inventory[validationfor10procent[result]] += 2;
		} else {
			userdb.inventory[validationfor10procent[result]] += 1;
		}

		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor10procent[result]][0]} ${lang[`loot_${validationfor10procent[result]}`]} ($${marketconfs[validationfor10procent[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');
		const embed = new Discord.RichEmbed()
			.setColor('#66ff33')
			.setDescription(`🎉 ${lootmessage}`);
		msg.channel.send({
			embed
		});
	} else if (d < 0.05) {
		const result = Math.floor(Math.random() * validationfor30procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		if (userdb.premium.status === true) {
			userdb.inventory[validationfor30procent[result]] += 2;
		} else {
			userdb.inventory[validationfor30procent[result]] += 1;
		}

		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor30procent[result]][0]} ${lang[`loot_${validationfor30procent[result]}`]} ($${marketconfs[validationfor30procent[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');

		const embed = new Discord.RichEmbed()
			.setColor('#66ff33')
			.setDescription(`🎉 ${lootmessage}`);
		msg.channel.send({
			embed
		});
	} else if (d < 0.2) {
		const result = Math.floor(Math.random() * validationfor50procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		if (userdb.premium.status === true) {
			userdb.inventory[validationfor50procent[result]] += 2;
		} else {
			userdb.inventory[validationfor50procent[result]] += 1;
		}

		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationfor50procent[result]][0]} ${lang[`loot_${validationfor50procent[result]}`]} ($${marketconfs[validationfor50procent[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');

		const embed = new Discord.RichEmbed()
			.setColor('#66ff33')
			.setDescription(`🎉 ${lootmessage}`);
		msg.channel.send({
			embed
		});
	} else {
		const result = Math.floor(Math.random() * validationforrest.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		if (userdb.premium.status === true) {
			userdb.inventory[validationforrest[result]] += 2;
		} else {
			userdb.inventory[validationforrest[result]] += 1;
		}

		const lootmessage = lang.loot_lootmessage.replace('%amount', `**$${creditsloot}**`).replace('%item', `${marketconfs[validationforrest[result]][0]} ${lang[`loot_${validationforrest[result]}`]} ($${marketconfs[validationforrest[result]][1]})`).replace('%howmany', userdb.premium.status === false ? '1' : '2');

		const embed = new Discord.RichEmbed()
			.setColor('#66ff33')
			.setDescription(`🎉 ${lootmessage}`);
		msg.channel.send({
			embed
		});
	}
	client.userdb.set(msg.author.id, userdb);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Games',
	aliases: ['l'],
	userpermissions: [],
	dashboardsettings: false,
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
