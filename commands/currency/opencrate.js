const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	const userdb = client.userdb.get(msg.author.id);
	const validation = [
		['crate', 'apple', 'phone'],
		['cat', 'football', 'joystick'],
		['clock', 'dog', 'pickaxe'],
		['dog', 'bag', 'phone']
	];
	const marketconfs = client.botconfs.get('market');

	const result = Math.floor(Math.random() * validation.length);

	if (userdb.inventory.cratekey === 0 && userdb.inventory.crate) return msg.reply(lang.opencrate_nocrateandkey);
	if (userdb.inventory.cratekey === 0) return msg.reply(lang.opencrate_nocrate);
	if (userdb.inventory.crate === 0) return msg.reply(lang.opencrate_nocratekey);

	for (var i = 0; i < validation[result]; i++) {
		userdb.inventory[validation[result][i]] = userdb.inventory[validation[result][i]] + 1;
		await client.userdb.set(msg.author.id, userdb);
	}

	userdb.inventory.cratekey = userdb.inventory.cratekey - 1;
	userdb.inventory.crate = userdb.inventory.crate - 1;
	await client.userdb.set(msg.author.id, userdb);

	const won = lang.opencrate_won.replace('%item1', `${marketconfs[validation[result][0]][0]} ${lang[`loot_${validation[result][0]}`]}`).replace('%amount1', marketconfs[validation[result][0]][1]).replace('%item2', `${marketconfs[validation[result][1]][0]} ${lang[`loot_${validation[result][1]}`]}`).replace('%amount2', marketconfs[validation[result][1]][1]).replace('%item3', `${marketconfs[validation[result][2]][0]} ${lang[`loot_${validation[result][2]}`]}`).replace('%amount3', marketconfs[validation[result][2]][1]);
	msg.reply(`📁 ${won}`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
	cooldown: 1
};
exports.help = {
	name: 'opencrate',
	description: 'With this command, you can open crates with a cratekey and win cool items!',
	usage: 'opencrate',
	example: ['opencrate'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
