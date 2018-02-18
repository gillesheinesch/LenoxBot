const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const validationforbuysell = ['sell', 'buy'];
	const validationforitemsbuysell = ['📁', '🔑', '⛏', '🕹', '🏠', '👜', '💠', '🐶', '🐱', '🍎', '⚽', '🚙', '📱', '💻', '📷', '⏰', '📩', '🌹', '☂', '🍔', '🥐', '🏀', '⌚', '📽', '🔦', '🛏', '🔨', '📖', '🔍', '🍌'];
	const itemsnames = ['crate', 'cratekey', 'pickaxe', 'joystick', 'house', 'bag', 'diamond', 'dog', 'cat', 'apple', 'football', 'car', 'phone', 'computer', 'camera', 'clock', 'inventoryslotticket', 'rose', 'umbrella', 'hamburger', 'croissant', 'basketball', 'watch', 'projector', 'flashlight', 'bed', 'hammer', 'book', 'mag', 'banana'];
	const marketconfs = client.botconfs.get('market');
	const userdb = client.userdb.get(msg.author.id);

	const input = args.slice();
	const sellorbuycheck = args.slice(0, 1);
	const itemcheck = args.slice(2);
	const howmanycheck = args.slice(1, 2);

	if (!input || input.length === 0) {
		var array1 = [];
		var array2 = [];

		const shop = lang.shop_shop.replace('%lenoxbot', client.user.username);
		const embed = new Discord.RichEmbed()
			.setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
			.setColor('#009933')
			.setThumbnail('https://imgur.com/7qLINgn.png')
			.setAuthor(shop);

		for (const i in marketconfs) {
			array1.push(`${marketconfs[i][0]} ${lang[`loot_${i}`]}`);
			array2.push(`📥 $${marketconfs[i][1]} 📤 $${marketconfs[i][2]}`);
		}

		const firstembed = array1.slice(0, 14);
		const secondembed = array2.slice(0, 14);

		for (var i = 0; i < firstembed.length; i++) {
			embed.addField(firstembed[i], secondembed[i], true);
		}

		const message = await msg.channel.send({
			embed
		});

		await message.react('◀');
		await message.react('▶');

		var firsttext = 0;
		var secondtext = 14;

		var collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 30000
		});
		collector.on('collect', r => {
			var reactionadd = array1.slice(firsttext + 14, secondtext + 14).length;
			var reactionremove = array1.slice(firsttext - 14, secondtext - 14).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.remove(msg.author.id);
				const embedaddfield1 = array1.slice(firsttext + 14, secondtext + 14);
				const embedaddfield2 = array2.slice(firsttext + 14, secondtext + 14);

				firsttext = firsttext + 14;
				secondtext = secondtext + 14;

				const shop = lang.shop_shop.replace('%lenoxbot', client.user.username);
				const newembed = new Discord.RichEmbed()
					.setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
					.setColor('#009933')
					.setThumbnail('https://imgur.com/7qLINgn.png')
					.setAuthor(shop);

				for (var i = 0; i < embedaddfield1.length; i++) {
					newembed.addField(embedaddfield1[i], embedaddfield2[i], true);
				}

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.remove(msg.author.id);
				const embedaddfield1 = array1.slice(firsttext - 14, secondtext - 14);
				const embedaddfield2 = array2.slice(firsttext - 14, secondtext - 14);

				firsttext = firsttext - 14;
				secondtext = secondtext - 14;

				const shop = lang.shop_shop.replace('%lenoxbot', client.user.username);
				const newembed = new Discord.RichEmbed()
					.setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
					.setColor('#009933')
					.setThumbnail('https://imgur.com/7qLINgn.png')
					.setAuthor(shop);

				for (var i = 0; i < embedaddfield1.length; i++) {
					newembed.addField(embedaddfield1[i], embedaddfield2[i], true);
				}

				message.edit({
					embed: newembed
				});
			}
		});
		await collector.on('end', (collected, reason) => {
			message.react('❌');
		});
		return undefined;
	}

	if (isNaN(howmanycheck[0])) {
		const commanderror = lang.shop_commanderror.replace('%prefix', tableload.prefix);
		return msg.reply(commanderror);
	}

	for (i = 0; i < sellorbuycheck.length; i++) {
		if (validationforbuysell.indexOf(sellorbuycheck[i].toLowerCase()) >= 0) {
			if (sellorbuycheck[0].toLowerCase() == "sell") {
				// Check if the item exists in the user's inventory
				for (i = 0; i < itemcheck.length; i++) {
					if (validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase()) >= 0) {
						i = validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase());
						if (itemcheck[0] == validationforitemsbuysell[i]) {
							const notown = lang.shop_notown.replace('%prefix', tableload.prefix);
							if (userdb.inventory[itemsnames[i]] < howmanycheck) return msg.reply(notown);

							const amount = parseInt(marketconfs[itemsnames[i]][2]) * parseInt(howmanycheck[0]);
							userdb.inventory[itemsnames[i]] = userdb.inventory[itemsnames[i]] - parseInt(howmanycheck[0]);

							sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
								if (!row) {
									sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
								}
								sql.run(`UPDATE medals SET medals = ${row.medals + amount} WHERE userId = ${msg.author.id}`);
							});

							await client.userdb.set(msg.author.id, userdb);

							const sold = lang.shop_sold.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${itemsnames[i]}`]}**`).replace('%amount', amount).replace('%howmany', howmanycheck[0]);
							return msg.reply(sold);
						}
					}
				}
			} else if (sellorbuycheck[0].toLowerCase() == "buy") {
				// Check if the use can buy this item
				for (i = 0; i < itemcheck.length; i++) {
					if (validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase()) >= 0) {
						i = validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase());
						if (itemcheck[0] == validationforitemsbuysell[i]) {
							var inventoryslotcheck = 0;
							for (var x = 0; x < itemsnames.length; x++) {
								inventoryslotcheck = inventoryslotcheck + parseInt(userdb.inventory[itemsnames[x]]);
							}

							const inventoryfull = lang.shop_inventoryfull.replace('%prefix', tableload.prefix);
							if ((inventoryslotcheck + parseInt(howmanycheck[0])) > userdb.inventoryslots) return msg.reply(inventoryfull);

							const msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
							if (msgauthortable.medals <= (marketconfs[itemsnames[i]][1] * parseInt(howmanycheck[0]))) return msg.channel.send(lang.shop_notenoughcredits);
			
							const amount = parseInt(marketconfs[itemsnames[i]][1]) * parseInt(howmanycheck[0]);
							userdb.inventory[itemsnames[i]] = userdb.inventory[itemsnames[i]] + parseInt(howmanycheck[0]);

							sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
								if (!row) {
									sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
								}
								sql.run(`UPDATE medals SET medals = ${row.medals - amount} WHERE userId = ${msg.author.id}`);
							});

							await client.userdb.set(msg.author.id, userdb);

							const bought = lang.shop_bought.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${itemsnames[i]}`]}**`).replace('%amount', amount).replace('%howmany', howmanycheck[0]);
							return msg.reply(bought);
						}
					}
				}
			}
		}
	}
	const commanderror = lang.shop_commanderror.replace('%prefix', tableload.prefix);
	return msg.reply(commanderror);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['market'],
	userpermissions: []
};
exports.help = {
	name: 'shop',
	description: 'You can view the list of all purchasable items and sell or buy items',
	usage: 'shop [buy/sell] [amount] [emoji of the item]',
	example: ['shop', 'shop buy 1 :dog:', 'shop sell 3 :dog:'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
