const Discord = require('discord.js');
const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
exports.run = async (client, msg, args, lang) => {
	const tableload = await client.guildconfs.get(msg.guild.id);
	const botconfs = await client.botconfs.get('market');
	const validationforbuysell = ['sell', 'buy'];
	const validationforitemsbuysell = ['📁', '🔑', '⛏', '🕹', '🏠', '👜', '💠', '🐶', '🐱', '🍎', '⚽', '🚙', '📱', '💻', '📷', '⏰', '📩', '🌹', '☂', '🍔', '🥐', '🏀', '⌚', '📽', '🔦', '🛏', '🔨', '📖', '🔍', '🍌', '🚜', '💉', '🔫', '🔪'];
	const itemsnames = ['crate', 'cratekey', 'pickaxe', 'joystick', 'house', 'bag', 'diamond', 'dog', 'cat', 'apple', 'football', 'car', 'phone', 'computer', 'camera', 'clock', 'inventoryslotticket', 'rose', 'umbrella', 'hamburger', 'croissant', 'basketball', 'watch', 'projector', 'flashlight', 'bed', 'hammer', 'book', 'mag', 'banana', 'tractor', 'syringe', 'gun', 'knife'];
	const marketconfs = await client.botconfs.get('market');
	const userdb = await client.userdb.get(msg.author.id);

	const input = args.slice();
	const sellorbuycheck = args.slice(0, 1);
	const itemcheck = args.slice(2);
	const howmanycheck = args.slice(1, 2);

	if (!input || input.length === 0) {
		const array1 = [];
		const array2 = [];

		const shop = lang.shop_shop.replace('%lenoxbot', client.user.username);
		const embed = new Discord.RichEmbed()
			.setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
			.setColor('#009933')
			.setThumbnail('https://imgur.com/7qLINgn.png')
			.setAuthor(shop);

		/* eslint guard-for-in: 0 */
		for (const i in marketconfs) {
			array1.push(`${marketconfs[i][0]} ${lang[`loot_${i}`]}`);
			array2.push(`📥 $${marketconfs[i][1]} 📤 $${marketconfs[i][2]}`);
		}

		const firstembed = array1.slice(0, 14);
		const secondembed = array2.slice(0, 14);

		for (let i = 0; i < firstembed.length; i++) {
			embed.addField(firstembed[i], secondembed[i], true);
		}

		const message = await msg.channel.send({
			embed
		});

		await message.react('◀');
		await message.react('▶');

		let firsttext = 0;
		let secondtext = 14;

		const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
			time: 30000
		});
		collector.on('collect', r => {
			const reactionadd = array1.slice(firsttext + 14, secondtext + 14).length;
			const reactionremove = array1.slice(firsttext - 14, secondtext - 14).length;

			if (r.emoji.name === '▶' && reactionadd !== 0) {
				r.remove(msg.author.id);
				const embedaddfield1 = array1.slice(firsttext + 14, secondtext + 14);
				const embedaddfield2 = array2.slice(firsttext + 14, secondtext + 14);

				firsttext += 14;
				secondtext += 14;

				const newembed = new Discord.RichEmbed()
					.setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
					.setColor('#009933')
					.setThumbnail('https://imgur.com/7qLINgn.png')
					.setAuthor(shop);

				for (let i = 0; i < embedaddfield1.length; i++) {
					newembed.addField(embedaddfield1[i], embedaddfield2[i], true);
				}

				message.edit({
					embed: newembed
				});
			} else if (r.emoji.name === '◀' && reactionremove !== 0) {
				r.remove(msg.author.id);
				const embedaddfield1 = array1.slice(firsttext - 14, secondtext - 14);
				const embedaddfield2 = array2.slice(firsttext - 14, secondtext - 14);

				firsttext -= 14;
				secondtext -= 14;

				const newembed = new Discord.RichEmbed()
					.setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
					.setColor('#009933')
					.setThumbnail('https://imgur.com/7qLINgn.png')
					.setAuthor(shop);

				for (let i = 0; i < embedaddfield1.length; i++) {
					newembed.addField(embedaddfield1[i], embedaddfield2[i], true);
				}

				message.edit({
					embed: newembed
				});
			}
		});
		await collector.on('end', () => {
			message.react('❌');
		});
		return;
	}

	for (let i = 0; i < sellorbuycheck.length; i++) {
		if (validationforbuysell.indexOf(sellorbuycheck[i].toLowerCase()) >= 0) {
			if (sellorbuycheck[0].toLowerCase() === 'sell') {
				// Check if the item exists in the user's inventory
				if (args.slice(1).join(' ').toLowerCase() === 'all') {
					let inventoryslotcheck = 0;
					for (let x = 0; x < itemsnames.length; x++) {
						inventoryslotcheck += parseInt(userdb.inventory[itemsnames[x]], 10);
					}
					const error = lang.inventory_error.replace('%prefix', tableload.prefix);
					if (inventoryslotcheck === 0) return msg.reply(error);

					const allitemsininventory = [];
					for (let xx = 0; xx < itemsnames.length; xx++) {
						if (userdb.inventory[itemsnames[xx]] !== 0) {
							allitemsininventory.push([xx, userdb.inventory[itemsnames[xx]], marketconfs[itemsnames[xx]][0], marketconfs[itemsnames[xx]][2], itemsnames[xx]]);
						}
					}

					let amounttoreceive = 0;
					for (let xxxxx = 0; xxxxx < allitemsininventory.length; xxxxx++) {
						amounttoreceive += parseInt(allitemsininventory[xxxxx][3] * allitemsininventory[xxxxx][1], 10);
					}

					amounttoreceive = parseInt(amounttoreceive, 10);

					for (let xxx = 0; xxx < allitemsininventory.length; xxx++) {
						userdb.inventory[allitemsininventory[xxx][4]] = 0;
					}

					await client.botconfs.set('market', botconfs);
					await client.userdb.set(msg.author.id, userdb);

					const messageedit = [];
					for (let xxxx = 0; xxxx < allitemsininventory.length; xxxx++) {
						messageedit.push(`${allitemsininventory[xxxx][1]}x ${allitemsininventory[xxxx][2]} ${lang[`loot_${allitemsininventory[xxxx][4]}`]}`);
					}

					await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
						if (!row) {
							sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
						}
						sql.run(`UPDATE medals SET medals = ${row.medals + amounttoreceive} WHERE userId = ${msg.author.id}`);
					});

					const sellall = lang.shop_sellall.replace('%items', messageedit.join(', ')).replace('%amount', `**${amounttoreceive}**`);
					return msg.reply(sellall);
				}

				if (isNaN(howmanycheck[0])) {
					const commanderror = lang.shop_commanderror.replace('%prefix', tableload.prefix);
					return msg.reply(commanderror);
				}

				for (i = 0; i < itemcheck.length; i++) {
					if (validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase()) >= 0) {
						i = validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase());
						if (itemcheck[0] === validationforitemsbuysell[i]) {
							const notown = lang.shop_notown.replace('%prefix', tableload.prefix);
							if (userdb.inventory[itemsnames[i]] < howmanycheck) return msg.reply(notown);

							const amount = parseInt(marketconfs[itemsnames[i]][2], 10) * parseInt(howmanycheck[0], 10);
							userdb.inventory[itemsnames[i]] -= parseInt(howmanycheck[0], 10);

							sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
								if (!row) {
									sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
								}
								sql.run(`UPDATE medals SET medals = ${row.medals + amount} WHERE userId = ${msg.author.id}`);
							});

							await client.botconfs.set('market', botconfs);
							await client.userdb.set(msg.author.id, userdb);

							const sold = lang.shop_sold.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${itemsnames[i]}`]}**`).replace('%amount', amount).replace('%howmany', howmanycheck[0]);
							return msg.reply(sold);
						}
					}
				}
			} else if (sellorbuycheck[0].toLowerCase() === 'buy') {
				if (isNaN(howmanycheck[0])) {
					const commanderror = lang.shop_commanderror.replace('%prefix', tableload.prefix);
					return msg.reply(commanderror);
				}
				// Check if the use can buy this item
				for (i = 0; i < itemcheck.length; i++) {
					if (validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase()) >= 0) {
						i = validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase());
						if (itemcheck[0] === validationforitemsbuysell[i]) {
							let inventoryslotcheck = 0;
							for (let x = 0; x < itemsnames.length; x++) {
								inventoryslotcheck += parseInt(userdb.inventory[itemsnames[x]], 10);
							}

							const inventoryfull = lang.shop_inventoryfull.replace('%prefix', tableload.prefix);
							if ((inventoryslotcheck + parseInt(howmanycheck[0], 10)) > userdb.inventoryslots) return msg.reply(inventoryfull);

							const msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
							if (msgauthortable.medals <= (marketconfs[itemsnames[i]][1] * parseInt(howmanycheck[0], 10))) return msg.channel.send(lang.shop_notenoughcredits);

							const amount = parseInt(marketconfs[itemsnames[i]][1], 10) * parseInt(howmanycheck[0], 10);
							userdb.inventory[itemsnames[i]] += parseInt(howmanycheck[0], 10);

							sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
								if (!row) {
									sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
								}
								sql.run(`UPDATE medals SET medals = ${row.medals - amount} WHERE userId = ${msg.author.id}`);
							});

							await client.botconfs.set('market', botconfs);
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
	shortDescription: 'General',
	aliases: ['market'],
	userpermissions: [],
	dashboardsettings: false
};
exports.help = {
	name: 'shop',
	description: 'You can view the list of all purchasable items and sell or buy items',
	usage: 'shop [buy/sell] [amount/all (just works for sell)] [emoji of the item]',
	example: ['shop', 'shop buy 1 :dog:', 'shop sell 3 :dog:', 'shop sell all'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
