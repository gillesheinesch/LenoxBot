const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	const tableload = client.guildconfs.get(msg.guild.id);
	const validationforbuysell = ['sell, buy'];
	const validationforitemsbuysell = ['📁', '🔑', '⛏', '🕹', '🏠', '👜', '💠', '🐶', '🐱', '🍎', '⚽', '🚙', '📱', '💻', '📷', '⏰'];
	const itemsnames = ['crate', 'cratekey', 'pickaxe', 'joystick', 'house', 'bag', 'diamond', 'dog', 'cat', 'apple', 'football', 'car', 'phone', 'computer', 'camera', 'clock'];
	const marketconfs = client.botconfs.get('market');
	const userdb = client.userdb.get(msg.author.id);

	const input = args.slice();
	const sellorbuycheck = args.slice(0, 1);
	const itemcheck = args.slice(1);

	var checkifitemexists = 0;

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
		collector.on('end', (collected, reason) => {
			message.react('❌');
		});
	}

	for (i = 0; i < sellorbuycheck.length; i++) {
		if (validationforbuysell.indexOf(sellorbuycheck[i].toLowerCase()) >= 0) {
			if (sellorbuycheck[0].toLowerCase() == "sell") {
				// Check if the item exists in the user's inventory
				for (i = 0; i < itemcheck.length; i++) {
					if (validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase()) >= 0) {
						if (itemcheck[0] == validationforitemsbuysell[i]) {
							const notown = lang.shop_notown.replace('%prefix', tableload.prefix);
							if (userdb.inventory[itemsnames[i]] === 0) return msg.reply(lang.shop_notown);
							const amount = parseInt(marketconfs[itemsnames[i]][2]);
							userdb.inventory[itemsnames[i]] = userdb.inventory[itemsnames[i]] - 1;
							sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
								if (!row) {
									sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
								}
								sql.run(`UPDATE medals SET medals = ${row.medals + amount} WHERE userId = ${msg.author.id}`);
							});

							await client.userdb.set(msg.author.id, userdb);

							const sold = lang.shop_sold.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${itemsnames[i]}`]}**`).replace('%amount', amount);
							return msg.reply(sold);
						}
					}
				}
			} else if (sellorbuycheck[0].toLowerCase() == "buy") {
				// Check if the use can buy this item
				for (i = 0; i < itemcheck.length; i++) {
					if (itemcheck.indexOf(validationforitemsbuysell[i].toLowerCase()) >= 0) {
						if (itemcheck[0] == validationforitemsbuysell[i]) {
							const msgauthortable = await sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`);
							if (msgauthortable.medals <= marketconfs[itemsnames[i]][1]) return msg.channel.send('Not enough credits');
			
							const amount = parseInt(marketconfs[itemsnames[i]][2]);
							userdb.inventory[itemsnames[i]] = userdb.inventory[itemsnames[i]] + 1;

							sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
								if (!row) {
									sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
								}
								sql.run(`UPDATE medals SET medals = ${row.medals - amount} WHERE userId = ${msg.author.id}`);
							});

							await client.userdb.set(msg.author.id, userdb);

							const bought = lang.shop_bought.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${itemsnames[i]}`]}**`).replace('%amount', amount);
							return msg.reply(bought);
						}
					}
				}
			}
		}
	}
	if (checkifitemexists === validationforitemsbuysell.length) {
		return msg.reply(lang.shop_itemnotexist);
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
	description: 'You can view the list of all purchasable items and sell or buy an item',
	usage: 'shop [buy/sell] [emoji of the item]',
	example: ['shop', 'shop buy :dog:', 'shop sell :dog:'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
