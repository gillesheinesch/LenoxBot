const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	var d = Math.random();
	const userdb = client.userdb.get(msg.author.id);
	const marketconfs = client.botconfs.get('market');

	const creditsloot = Math.floor(Math.random() * 70) + 1;

	if (d < 0.02) {
		var validationfor10procent = ['house', 'car', 'diamond'];
		const result = Math.floor(Math.random() * validationfor10procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});

		userdb.inventory[validationfor10procent[result]] = userdb.inventory[validationfor10procent[result]] + 1;
		await client.userdb.set(msg.author.id, userdb);

		validationfor10procent = [lang.loot_house, lang.loot_car, lang.loot_diamond];

		const lootmessage = lang.loot_lootmessage.replace('%amount', `$${creditsloot}`).replace('%item', `${marketconfs[validationfor10procent[result]][0]} ${validationfor10procent[result]} ($${marketconfs[validationfor10procent[result]][2]})`);
		return msg.reply(lootmessage);

	} else if (d < 0.1) {
		var validationfor30procent = ['phone', 'computer', 'camera', 'projector', 'bed', 'watch'];
		const result = Math.floor(Math.random() * validationfor30procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		userdb.inventory[validationfor30procent[result]] = userdb.inventory[validationfor30procent[result]] + 1;
		await client.userdb.set(msg.author.id, userdb);

		validationfor30procent = [lang.loot_phone, lang.loot_computer, lang.loot_camera];

		const lootmessage = lang.loot_lootmessage.replace('%amount', `$${creditsloot}`).replace('%item', `${marketconfs[validationfor30procent[result]][0]} ${validationfor30procent[result]} ($${marketconfs[validationfor30procent[result]][2]})`);
		return msg.reply(lootmessage);
	} else if (d < 0.3) {
		var validationfor50procent = ['cratekey', 'pickaxe', 'joystick', 'flashlight', 'hammer', 'inventoryslotticket'];
		const result = Math.floor(Math.random() * validationfor50procent.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		userdb.inventory[validationfor50procent[result]] = userdb.inventory[validationfor50procent[result]] + 1;
		await client.userdb.set(msg.author.id, userdb);

		validationfor50procent = [lang.loot_cratekey, lang.loot_pickaxe, lang.loot_joystick, lang.loot_flashlight, lang.loot_hammer, lang.loot_inventoryslotticket];

		const lootmessage = lang.loot_lootmessage.replace('%amount', `$${creditsloot}`).replace('%item', `${marketconfs[validationfor50procent[result]][0]} ${validationfor50procent[result]} ($${marketconfs[validationfor50procent[result]][2]})`);
		return msg.reply(lootmessage);
	} else {
		var validationforrest = ['crate', 'bag', 'dog', 'cat', 'apple', 'football', 'clock', 'rose', 'umbrella', 'hamburger', 'croissant', 'basketball', 'book', 'mag', 'banana'];
		const result = Math.floor(Math.random() * validationforrest.length);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + creditsloot} WHERE userId = ${msg.author.id}`);
		});


		userdb.inventory[validationforrest[result]] = userdb.inventory[validationforrest[result]] + 1;
		await client.userdb.set(msg.author.id, userdb);

		validationforrest = [lang.loot_crate, lang.loot_bag, lang.loot_dog, lang.loot_cat, lang.loot_apple, lang.loot_football, lang.loot_clock, lang.loot_rose, lang.loot_umbrella, lang.loot_hamburger, lang.loot_basketball, lang.loot_book, lang.loot_mag, lang.loot_banana];
		const lootmessage = lang.loot_lootmessage.replace('%amount', `$${creditsloot}`).replace('%item', `${marketconfs[validationforrest[result]][0]} ${validationforrest[result]} ($${marketconfs[validationforrest[result]][2]})`);
		return msg.channel.send(`🎉 ${lootmessage}`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
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
