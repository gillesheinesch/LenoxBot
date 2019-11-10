const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const marketitemskeys = require('../../marketitems-keys.json');

module.exports = class shopCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'shop',
      group: 'currency',
      memberName: 'shop',
      description: 'You can view the list of all purchasable items and sell or buy items',
      format: 'shop [buy/sell] [amount/all (only works for sell)] [emoji or name of the item]',
      aliases: ['market'],
      examples: ['shop', 'shop buy 1 dog', 'shop sell 3 🐶', 'shop sell all'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: false
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    const args = msg.content.split(' ').slice(1);

    const validationForBuySell = ['sell', 'buy', lang.shop_parameter_buy, lang.shop_parameter_sell];
    const validationforitemsbuysell = [];
    const nameOfTheItems = [];
    const nameOfTheItemsInServerLanguage = [];

    for (const x in marketitemskeys) {
      validationforitemsbuysell.push(marketitemskeys[x][0]);
      nameOfTheItems.push(x);
      nameOfTheItemsInServerLanguage.push(lang[`loot_${x}`].toLowerCase());
    }

    const input = args.slice();
    const sellorbuycheck = args.slice(0, 1);
    const itemcheck = args.slice(2);
    const howmanycheck = args.slice(1, 2);

    if (!input || input.length === 0) {
      const array1 = [];
      const array2 = [];

      const shop = lang.shop_shop.replace('%lenoxbot', msg.client.user.username);
      const embed = new Discord.MessageEmbed()
        .setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
        .setColor('#009933')
        .setThumbnail('https://imgur.com/7qLINgn.png')
        .setAuthor(shop, msg.client.user.displayAvatarURL());

      /* eslint guard-for-in: 0 */
      for (const i in msg.client.provider.getBotsettings('botconfs', 'market')) {
        array1.push(`${msg.client.provider.getBotsettings('botconfs', 'market')[i][0]} ${lang[`loot_${i}`]}`);
        array2.push(`📥 $${msg.client.provider.getBotsettings('botconfs', 'market')[i][1]} 📤 $${msg.client.provider.getBotsettings('botconfs', 'market')[i][2]}`);
      }

      const firstembed = array1.slice(0, 14);
      const secondembed = array2.slice(0, 14);

      for (let i = 0; i < firstembed.length; i += 1) {
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
      collector.on('collect', (r) => {
        const reactionadd = array1.slice(firsttext + 14, secondtext + 14).length;
        const reactionremove = array1.slice(firsttext - 14, secondtext - 14).length;

        if (r.emoji.name === '▶' && reactionadd !== 0) {
          r.users.remove(msg.author.id);
          const embedaddfield1 = array1.slice(firsttext + 14, secondtext + 14);
          const embedaddfield2 = array2.slice(firsttext + 14, secondtext + 14);

          firsttext += 14;
          secondtext += 14;

          const newembed = new Discord.MessageEmbed()
            .setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
            .setColor('#009933')
            .setThumbnail('https://imgur.com/7qLINgn.png')
            .setAuthor(shop, msg.client.user.displayAvatarURL());

          for (let i = 0; i < embedaddfield1.length; i += 1) {
            newembed.addField(embedaddfield1[i], embedaddfield2[i], true);
          }

          message.edit({
            embed: newembed
          });
        }
        else if (r.emoji.name === '◀' && reactionremove !== 0) {
          r.users.remove(msg.author.id);
          const embedaddfield1 = array1.slice(firsttext - 14, secondtext - 14);
          const embedaddfield2 = array2.slice(firsttext - 14, secondtext - 14);

          firsttext -= 14;
          secondtext -= 14;

          const newembed = new Discord.MessageEmbed()
            .setDescription(`📥= ${lang.shop_buy} 📤= ${lang.shop_sell}`)
            .setColor('#009933')
            .setThumbnail('https://imgur.com/7qLINgn.png')
            .setAuthor(shop, msg.client.user.displayAvatarURL());

          for (let i = 0; i < embedaddfield1.length; i += 1) {
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

    for (let i = 0; i < sellorbuycheck.length; i += 1) {
      if (validationForBuySell.indexOf(sellorbuycheck[i].toLowerCase()) >= 0) {
        if (sellorbuycheck[0].toLowerCase() === 'sell' || sellorbuycheck[0].toLowerCase() === lang.shop_parameter_sell.toLowerCase()) {
          // Check if the item exists in the user's inventory
          if (args.slice(1).join(' ').toLowerCase() === 'all' || args.slice(1).join(' ').toLowerCase() === lang.shop_parameter_all.toLowerCase()) {
            let inventoryslotcheck = 0;
            for (let x = 0; x < nameOfTheItems.length; x++) {
              inventoryslotcheck += parseInt(msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[x]], 10);
            }
            const error = lang.inventory_error.replace('%prefix', prefix);
            if (inventoryslotcheck === 0) return msg.reply(error);

            const allitemsininventory = [];
            for (let xx = 0; xx < nameOfTheItems.length; xx++) {
              if (msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[xx]] !== 0) {
                allitemsininventory.push([xx, msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[xx]], msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[xx]][0], msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[xx]][2], nameOfTheItems[xx]]);
              }
            }

            let amounttoreceive = 0;
            for (let xxxxx = 0; xxxxx < allitemsininventory.length; xxxxx++) {
              amounttoreceive += parseInt(allitemsininventory[xxxxx][3] * allitemsininventory[xxxxx][1], 10);
            }

            amounttoreceive = parseInt(amounttoreceive, 10);

            for (let xxx = 0; xxx < allitemsininventory.length; xxx++) {
              const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
              currentInventory[allitemsininventory[xxx][4]] = 0;
              await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);
            }

            const messageedit = [];
            for (let xxxx = 0; xxxx < allitemsininventory.length; xxxx++) {
              messageedit.push(`${allitemsininventory[xxxx][1]}x ${allitemsininventory[xxxx][2]} ${lang[`loot_${allitemsininventory[xxxx][4]}`]}`);
            }

            let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
            currentCredits += amounttoreceive;
            await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

            const sellall = lang.shop_sellall.replace('%items', messageedit.join(', ')).replace('%amount', `**${amounttoreceive}**`);
            const soldallEmbed = new Discord.MessageEmbed()
              .setDescription(sellall)
              .setColor('ORANGE');
            return msg.channel.send({
              embed: soldallEmbed
            });
          }

          if (isNaN(howmanycheck[0]) || !howmanycheck[0]) {
            const commanderror = lang.shop_commanderror.replace('%prefix', prefix);
            const commanderrorEmbed = new Discord.MessageEmbed()
              .setDescription(commanderror)
              .setColor('RED');
            return msg.channel.send({
              embed: commanderrorEmbed
            });
          }

          for (i = 0; i < itemcheck.length; i += 1) {
            if (validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase()) >= 0) {
              i = validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase());
              if (itemcheck[0] === validationforitemsbuysell[i] || itemcheck[0] === lang[`loot_${nameOfTheItems[i]}`]) {
                const notown = lang.shop_notown.replace('%prefix', prefix);
                if (msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[i]] < howmanycheck) return msg.reply(notown);

                const amount = parseInt(msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[i]][2], 10) * parseInt(howmanycheck[0], 10);
                const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
                currentInventory[nameOfTheItems[i]] -= parseInt(howmanycheck[0], 10);
                await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

                let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
                currentCredits += amount;
                await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

                const sold = lang.shop_sold.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${nameOfTheItems[i]}`]}**`).replace('%amount', amount).replace('%howmany', howmanycheck[0]);
                const soldEmbed = new Discord.MessageEmbed()
                  .setDescription(sold)
                  .setColor('ORANGE');
                return msg.channel.send({
                  embed: soldEmbed
                });
              }
            }
            if (nameOfTheItemsInServerLanguage.indexOf(itemcheck[i].toLowerCase()) >= 0) {
              i = nameOfTheItemsInServerLanguage.indexOf(itemcheck[i].toLowerCase());
              if (itemcheck[0].toLowerCase() === lang[`loot_${nameOfTheItems[i]}`].toLowerCase()) {
                const notown = lang.shop_notown.replace('%prefix', prefix);
                if (msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[i]] < howmanycheck) return msg.reply(notown);

                const amount = parseInt(msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[i]][2], 10) * parseInt(howmanycheck[0], 10);
                const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
                currentInventory[nameOfTheItems[i]] -= parseInt(howmanycheck[0], 10);
                await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

                let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
                currentCredits += amount;
                await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

                const sold = lang.shop_sold.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${nameOfTheItems[i]}`]}**`).replace('%amount', amount).replace('%howmany', howmanycheck[0]);
                const soldEmbed = new Discord.MessageEmbed()
                  .setDescription(sold)
                  .setColor('ORANGE');
                return msg.channel.send({
                  embed: soldEmbed
                });
              }
            }
          }
        }
        else if (sellorbuycheck[0].toLowerCase() === 'buy' || sellorbuycheck[0].toLowerCase() === lang.shop_parameter_buy.toLowerCase()) {
          if (isNaN(howmanycheck[0]) || !howmanycheck[0]) {
            const commanderror = lang.shop_commanderror.replace('%prefix', prefix);
            const commanderrorEmbed = new Discord.MessageEmbed()
              .setDescription(commanderror)
              .setColor('RED');
            return msg.channel.send({
              embed: commanderrorEmbed
            });
          }
          // Check if the use can buy this item
          for (i = 0; i < itemcheck.length; i += 1) {
            if (validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase()) >= 0) {
              i = validationforitemsbuysell.indexOf(itemcheck[i].toLowerCase());
              if (itemcheck[0] === validationforitemsbuysell[i]) {
                let inventoryslotcheck = 0;
                for (let x = 0; x < nameOfTheItems.length; x++) {
                  inventoryslotcheck += parseInt(msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[x]], 10);
                }

                const inventoryfull = lang.shop_inventoryfull.replace('%prefix', prefix).replace('%prefix', prefix);
                if ((inventoryslotcheck + parseInt(howmanycheck[0], 10)) > msg.client.provider.getUser(msg.author.id, 'inventoryslots')) return msg.reply(inventoryfull);

                const msgauthortable = msg.client.provider.getUser(msg.author.id, 'credits');
                if (msgauthortable <= (msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[i]][1] * parseInt(howmanycheck[0], 10))) return msg.channel.send(lang.shop_notenoughcredits);

                const amount = parseInt(msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[i]][1], 10) * parseInt(howmanycheck[0], 10);
                const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
                currentInventory[nameOfTheItems[i]] += parseInt(howmanycheck[0], 10);
                await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

                let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
                currentCredits -= amount;
                await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

                const bought = lang.shop_bought.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${nameOfTheItems[i]}`]}**`).replace('%amount', amount).replace('%howmany', howmanycheck[0]);
                const boughtEmbed = new Discord.MessageEmbed()
                  .setDescription(bought)
                  .setColor('GREEN');
                return msg.channel.send({
                  embed: boughtEmbed
                });
              }
            }
            if (nameOfTheItemsInServerLanguage.indexOf(itemcheck[i].toLowerCase()) >= 0) {
              i = nameOfTheItemsInServerLanguage.indexOf(itemcheck[i].toLowerCase());
              if (itemcheck[0].toLowerCase() === nameOfTheItemsInServerLanguage[i].toLowerCase()) {
                let inventoryslotcheck = 0;
                for (let x = 0; x < nameOfTheItems.length; x++) {
                  inventoryslotcheck += parseInt(msg.client.provider.getUser(msg.author.id, 'inventory')[nameOfTheItems[x]], 10);
                }

                const inventoryfull = lang.shop_inventoryfull.replace('%prefix', prefix).replace('%prefix', prefix);
                if ((inventoryslotcheck + parseInt(howmanycheck[0], 10)) > msg.client.provider.getUser(msg.author.id, 'inventoryslots')) return msg.reply(inventoryfull);

                const msgauthortable = msg.client.provider.getUser(msg.author.id, 'credits');
                if (msgauthortable <= (msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[i]][1] * parseInt(howmanycheck[0], 10))) return msg.channel.send(lang.shop_notenoughcredits);

                const amount = parseInt(msg.client.provider.getBotsettings('botconfs', 'market')[nameOfTheItems[i]][1], 10) * parseInt(howmanycheck[0], 10);
                const currentInventory = msg.client.provider.getUser(msg.author.id, 'inventory');
                currentInventory[nameOfTheItems[i]] += parseInt(howmanycheck[0], 10);
                await msg.client.provider.setUser(msg.author.id, 'inventory', currentInventory);

                let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
                currentCredits -= amount;
                await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

                const bought = lang.shop_bought.replace('%item', `${validationforitemsbuysell[i]} **${lang[`loot_${nameOfTheItems[i]}`]}**`).replace('%amount', amount).replace('%howmany', howmanycheck[0]);
                const boughtEmbed = new Discord.MessageEmbed()
                  .setDescription(bought)
                  .setColor('GREEN');
                return msg.channel.send({
                  embed: boughtEmbed
                });
              }
            }
          }
        }
      }
    }
    const commanderror = lang.shop_commanderror.replace('%prefix', prefix);
    const commanderrorEmbed = new Discord.MessageEmbed()
      .setDescription(commanderror)
      .setColor('RED');
    return msg.channel.send({
      embed: commanderrorEmbed
    });
  }
};
