const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const marketitemskeys = require('../../marketitems-keys.json');

module.exports = class giveitemCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'giveitem',
      group: 'currency',
      memberName: 'giveitem',
      description: 'Enables or disables the dailyremind',
      format: 'giveitem {@User} {amount} {emoji or name of the item}',
      aliases: [],
      examples: ['giveitem @Monkeyyy11#0001 7 🛴', 'giveitem @Monkeyyy11#0001 7 scooter'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const emojiOfTheItems = [];
    const nameOfTheItems = [];
    const nameOfTheItemsInServerLanguage = [];

    /* eslint guard-for-in: 0 */
    for (const x in marketitemskeys) {
      emojiOfTheItems.push(marketitemskeys[x][0]);
      nameOfTheItems.push(x);
      nameOfTheItemsInServerLanguage.push(lang[`loot_${x}`].toLowerCase());
    }

    const mention = msg.mentions.users.first();
    if (!mention) return msg.reply(lang.giveitem_nomention);
    const userdbOfMention = msg.client.provider.getUser(mention.id, 'inventory'); // Doesn't matter what is requested here
    if (!userdbOfMention) return msg.reply(lang.giveitem_nodb);

    const amount = args.slice(1, 2);
    if (!amount) return msg.reply(lang.giveitem_noamount);
    if (isNaN(Number(amount.join(' ')))) return msg.reply(lang.giveitem_nonumber);

    if (!emojiOfTheItems.includes(args.slice(2).join(' ')) && !nameOfTheItemsInServerLanguage.includes(args.slice(2).join(' ').toLowerCase())) return msg.reply(lang.giveitem_noitem);

    let index;
    if (emojiOfTheItems.includes(args.slice(2).join(' '))) {
      index = emojiOfTheItems.indexOf(args.slice(2).join(' ').toLowerCase());
    }
    else {
      index = nameOfTheItemsInServerLanguage.indexOf(args.slice(2).join(' ').toLowerCase());
    }

    if (msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[index]] < Number(amount)) return msg.reply(lang.giveitem_notown);

    let inventoryslotsCheck = 0;
    for (const x in userdbOfMention.inventory) {
      inventoryslotsCheck += Number(userdbOfMention.inventory[x]);
    }

    if (inventoryslotsCheck + Number(amount) > userdbOfMention.inventoryslots) return msg.reply(lang.giveitem_noinventoryslots);

    const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
    currentInventory[nameOfTheItems[index]] -= Number(amount);
    await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

    const currentInventoryMention = msg.client.provider.getUser(mention.id, 'inventory');
    currentInventoryMention[nameOfTheItems[index]] += Number(amount);
    await msg.client.provider.setUser(mention.id, 'inventory', currentInventoryMention);

    const embeddescription = lang.giveitem_embeddescription
      .replace('%user', msg.author.tag)
      .replace('%amount', amount)
      .replace('%emoji', emojiOfTheItems[index])
      .replace('%mentionuser', mention.tag);
    const successEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(embeddescription)
      .setColor('GREEN');

    return msg.channel.send({
      embed: successEmbed
    });
  }
};
