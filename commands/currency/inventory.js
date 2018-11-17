const Discord = require('discord.js');
const marketitemskeys = require('../../marketitems-keys.json');
exports.run = async (client, msg, args, lang) => {
	const userdb = client.userdb.get(msg.author.id);
	const tableload = client.guildconfs.get(msg.guild.id);
	const marketconfs = client.botconfs.get('market');

	const inventory = lang.inventory_inventory.replace('%authortag', msg.author.tag);
	const validation = ['upgrade'];

	for (let i = 0; i < args.slice().length; i++) {
		if (validation.indexOf(args.slice()[i].toLowerCase()) >= 0) {
			if (args.slice()[0].toLowerCase() === 'upgrade') {
				if (userdb.inventory.inventoryslotticket === 0) return msg.reply(lang.inventory_notickets);
				userdb.inventory.inventoryslotticket -= 1;
				userdb.inventoryslots += 1;
				client.userdb.set(msg.author.id, userdb);

				const ticketbought = lang.inventory_ticketbought.replace('%currentslots', `\`${userdb.inventoryslots}\``);
				return msg.reply(ticketbought);
			}
		}
	}

	const itemsnames = [];
	for (const x in marketitemskeys) {
		itemsnames.push(x);
	}

	let inventoryslotcheck = 0;
	for (let x = 0; x < itemsnames.length; x++) {
		inventoryslotcheck += parseInt(userdb.inventory[itemsnames[x]], 10);
	}

	const slots = lang.inventory_inventoryslots.replace('%slots', `**${inventoryslotcheck}/${userdb.inventoryslots}**`);
	const embed = new Discord.RichEmbed()
		.setDescription(slots)
		.setAuthor(inventory, msg.author.displayAvatarURL)
		.setColor('#009933');

	const array1 = [];
	const array2 = [];

	let check = 0;
	/* eslint guard-for-in: 0 */
	for (const i in userdb.inventory) {
		if (userdb.inventory[i] === 0) {
			check++;
		}

		const error = lang.inventory_error.replace('%prefix', tableload.prefix);
		if (check === Object.keys(userdb.inventory).length) return msg.reply(error);
		if (userdb.inventory[i] !== 0) {
			array1.push(`${marketconfs[i][0]} ${userdb.inventory[i]}x ${lang[`loot_${i}`]}`);
			array2.push(`**${lang.inventory_price}** 📥 $${marketconfs[i][1]} 📤 $${marketconfs[i][2]}`);
		}
	}

	if (array1.length <= 7) {
		for (let i = 0; i < array1.length; i++) {
			embed.addField(array1[i], array2[i]);
		}
		return msg.channel.send({
			embed
		});
	}

	const firstembed = array1.slice(0, 7);
	const secondembed = array2.slice(0, 7);

	for (let i = 0; i < firstembed.length; i++) {
		embed.addField(firstembed[i], secondembed[i]);
	}

	const message = await msg.channel.send({
		embed
	});

	await message.react('◀');
	await message.react('▶');

	let firsttext = 0;
	let secondtext = 7;

	const collector = message.createReactionCollector((reaction, user) => user.id === msg.author.id, {
		time: 30000
	});
	collector.on('collect', r => {
		const reactionadd = array1.slice(firsttext + 7, secondtext + 7).length;
		const reactionremove = array1.slice(firsttext - 7, secondtext - 7).length;

		if (r.emoji.name === '▶' && reactionadd !== 0) {
			r.remove(msg.author.id);
			const embedaddfield1 = array1.slice(firsttext + 7, secondtext + 7);
			const embedaddfield2 = array2.slice(firsttext + 7, secondtext + 7);

			firsttext += 7;
			secondtext += 7;

			const newembed = new Discord.RichEmbed()
				.setDescription(slots)
				.setAuthor(inventory, msg.author.displayAvatarURL)
				.setColor('#009933');

			for (let i = 0; i < embedaddfield1.length; i++) {
				newembed.addField(embedaddfield1[i], embedaddfield2[i]);
			}

			message.edit({
				embed: newembed
			});
		} else if (r.emoji.name === '◀' && reactionremove !== 0) {
			r.remove(msg.author.id);
			const embedaddfield1 = array1.slice(firsttext - 7, secondtext - 7);
			const embedaddfield2 = array2.slice(firsttext - 7, secondtext - 7);

			firsttext -= 7;
			secondtext -= 7;

			const newembed = new Discord.RichEmbed()
				.setDescription(slots)
				.setAuthor(inventory, msg.author.displayAvatarURL)
				.setColor('#009933');

			for (let i = 0; i < embedaddfield1.length; i++) {
				newembed.addField(embedaddfield1[i], embedaddfield2[i]);
			}

			message.edit({
				embed: newembed
			});
		}
	});
	collector.on('end', () => {
		message.react('❌');
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'General',
	aliases: ['inv'],
	userpermissions: [],
	dashboardsettings: false
};
exports.help = {
	name: 'inventory',
	description: 'Shows you your inventory',
	usage: 'inventory [upgrade]',
	example: ['inventory', 'inventory upgrade'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
