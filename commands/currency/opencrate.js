const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
const marketitemskeys = require('../../marketitems-keys.json');
exports.run = (client, msg, args, lang) => {
	const userdb = client.userdb.get(msg.author.id);
	const tableload = client.guildconfs.get(msg.guild.id);

	const validationOfItems = [];
	for (const x in marketitemskeys) {
		if (Number(marketitemskeys[x][2]) < 500) { // Between 200-499
			validationOfItems.push(x);
		}
	}
	const random1 = Math.floor(Math.random() * validationOfItems.length);
	const random2 = Math.floor(Math.random() * validationOfItems.length);
	const random3 = Math.floor(Math.random() * validationOfItems.length);
	const validation = [validationOfItems[random1], validationOfItems[random2], validationOfItems[random3]];

	const marketconfs = client.botconfs.get('market');

	let inventoryslotcheck = 0;
	/* eslint guard-for-in: 0 */
	for (const index in userdb.inventory) {
		inventoryslotcheck += parseInt(userdb.inventory[index], 10);
	}
	const inventoryfull = lang.shop_inventoryfull.replace('%prefix', tableload.prefix);
	if (inventoryslotcheck >= userdb.inventoryslots) {
		const timestamps = client.cooldowns.get('opencrate');
		delete timestamps[msg.author.id];
		client.cooldowns.set('opencrate', timestamps);
		return msg.reply(inventoryfull);
	}

	if (userdb.inventory.cratekey === 0 && userdb.inventory.crate === 0) {
		const timestamps = client.cooldowns.get('opencrate');
		delete timestamps[msg.author.id];
		client.cooldowns.set('opencrate', timestamps);
		return msg.reply(lang.opencrate_nocrateandkey);
	}

	if (userdb.inventory.cratekey === 0) {
		const timestamps = client.cooldowns.get('opencrate');
		delete timestamps[msg.author.id];
		client.cooldowns.set('opencrate', timestamps);
		return msg.reply(lang.opencrate_nocrate);
	}

	if (userdb.inventory.crate === 0) {
		const timestamps = client.cooldowns.get('opencrate');
		delete timestamps[msg.author.id];
		client.cooldowns.set('opencrate', timestamps);
		return msg.reply(lang.opencrate_nocratekey);
	}

	for (let i = 0; i < validation.length; i++) {
		userdb.inventory[validation[i]] += 1;
		client.userdb.set(msg.author.id, userdb);
	}

	userdb.inventory.cratekey -= 1;
	userdb.inventory.crate -= 1;
	client.userdb.set(msg.author.id, userdb);

	const won = lang.opencrate_won.replace('%item1', `${marketconfs[validation[0]][0]} ${lang[`loot_${validation[0]}`]}`).replace('%amount1', marketconfs[validation[0]][1]).replace('%item2', `${marketconfs[validation[1]][0]} ${lang[`loot_${validation[1]}`]}`)
		.replace('%amount2', marketconfs[validation[1]][1])
		.replace('%item3', `${marketconfs[validation[2]][0]} ${lang[`loot_${validation[2]}`]}`)
		.replace('%amount3', marketconfs[validation[2]][1]);
	msg.reply(`📁 ${won}`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'opencrate',
	description: 'With this command, you can open crates with a cratekey and win cool items!',
	usage: 'opencrate',
	example: ['opencrate'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
