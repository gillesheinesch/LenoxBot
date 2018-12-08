/* eslint guard-for-in: 0 */
const marketitemskeys = require('../../marketitems-keys.json');
const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
	const userdb = client.userdb.get(msg.author.id);

	const emojiOfTheItems = [];
	const nameOfTheItems = [];
	const nameOfTheItemsInServerLanguage = [];
	for (const x in marketitemskeys) {
		emojiOfTheItems.push(marketitemskeys[x][0]);
		nameOfTheItems.push(x);
		nameOfTheItemsInServerLanguage.push(lang[`loot_${x}`].toLowerCase());
	}

	const mention = msg.mentions.users.first();
	if (!mention) return msg.reply(lang.giveitem_nomention);
	const userdbOfMention = client.userdb.get(mention.id);
	if (!userdbOfMention) return msg.reply(lang.giveitem_nodb);

	const amount = args.slice(1, 2);
	if (!amount) return msg.reply(lang.giveitem_noamount);
	if (isNaN(Number(amount.join(' ')))) return msg.reply(lang.giveitem_nonumber);

	if (!emojiOfTheItems.includes(args.slice(2).join(' ')) && !nameOfTheItemsInServerLanguage.includes(args.slice(2).join(' ').toLowerCase())) return msg.reply(lang.giveitem_noitem);

	let index;
	if (emojiOfTheItems.includes(args.slice(2).join(' '))) {
		index = emojiOfTheItems.indexOf(args.slice(2).join(' ').toLowerCase());
	} else {
		index = nameOfTheItemsInServerLanguage.indexOf(args.slice(2).join(' ').toLowerCase());
	}

	if (userdb.inventory[nameOfTheItems[index]] < Number(amount)) return msg.reply(lang.giveitem_notown);

	let inventoryslotsCheck = 0;
	for (const x in userdbOfMention.inventory) {
		inventoryslotsCheck += Number(userdbOfMention.inventory[x]);
	}

	if (inventoryslotsCheck + Number(amount) > userdbOfMention.inventoryslots) return msg.reply(lang.giveitem_noinventoryslots);

	userdb.inventory[nameOfTheItems[index]] -= Number(amount);
	userdbOfMention.inventory[nameOfTheItems[index]] += Number(amount);

	client.userdb.set(msg.author.id, userdb);
	client.userdb.set(mention.id, userdbOfMention);

	const embeddescription = lang.giveitem_embeddescription
		.replace('%user', msg.author.tag)
		.replace('%amount', amount)
		.replace('%emoji', emojiOfTheItems[index])
		.replace('%mentionuser', mention.tag);
	const successEmbed = new Discord.RichEmbed()
		.setTimestamp()
		.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
		.setDescription(embeddescription)
		.setColor('GREEN');

	return msg.channel.send({
		embed: successEmbed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'General',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'giveitem',
	description: 'Give items from your inventory to other discord users',
	usage: 'giveitem {@User} {amount} {emoji or name of the item}',
	example: ['giveitem @Monkeyyy11#0001 7 🛴', 'giveitem @Monkeyyy11#0001 7 scooter'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
