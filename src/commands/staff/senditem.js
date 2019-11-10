const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');
const marketitemskeys = require('../../marketitems-keys.json');

module.exports = class senditemCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'senditem',
      group: 'staff',
      memberName: 'senditem',
      description: 'Sends a user an specific item',
      format: 'senditem {@User/userid} {itemname} {amount} {reason}',
      aliases: [],
      examples: ['senditem 352896116812939264 inventoryslotticket 1 Bug'],
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

    const moderatorRole = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator');
    const prmanagerRole = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'pr manager');
    if (!moderatorRole || !prmanagerRole) return msg.reply(lang.addrole_rolenotexist);
    if (!msg.member.roles.has(moderatorRole.id) && !msg.member.roles.has(prmanagerRole.id)) return msg.reply(lang.botownercommands_error);

    const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args.slice(0, 1).join(' ');
    if (!user) return msg.reply(lang.senditem_nomention);

    const emojiOfTheItems = [];
    const nameOfTheItems = [];
    const nameOfTheItemsInServerLanguage = [];

    /* eslint guard-for-in: 0 */
    // eslint-disable-next-line no-restricted-syntax
    for (const x in marketitemskeys) {
      emojiOfTheItems.push(marketitemskeys[x][0]);
      nameOfTheItems.push(x);
      nameOfTheItemsInServerLanguage.push(lang[`loot_${x}`].toLowerCase());
    }

    const item = args.slice(1, 2);
    if (!item || !item.length) return msg.reply(lang.senditem_noitem);
    if (!emojiOfTheItems.includes(item.join(' ')) && !nameOfTheItemsInServerLanguage.includes(item.join(' ').toLowerCase())) return msg.reply(lang.senditem_itemnotexist);

    let index;
    if (emojiOfTheItems.includes(item.join(' '))) {
      index = emojiOfTheItems.indexOf(item.join(' ').toLowerCase());
    }
    else {
      index = nameOfTheItemsInServerLanguage.indexOf(item.join(' ').toLowerCase());
    }

    const amount = args.slice(2, 3);
    if (!amount || !amount.length) return msg.reply(lang.senditem_noamount);
    if (isNaN(amount) || amount <= 0) return msg.reply(lang.senditem_higherthan0);

    const reason = args.slice(3);
    if (!reason || !reason.length) return msg.reply(lang.senditem_noreason);

    if (!msg.client.provider.getUser(user, 'inventory')) return msg.reply(lang.senditem_notexist);

    const currentInventory = msg.client.provider.getUser(user, 'inventory');
    currentInventory[nameOfTheItems[index]] += Number(amount);
    await msg.client.provider.setUser(user, 'inventory', currentInventory);

    const infoEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor('BLUE')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(lang.senditem_embeditemsset)
      .addField(lang.senditem_embeduser, msg.client.users.has(user) ? `${msg.client.users.get(user).tag} (${user})` : user)
      .addField(lang.senditem_embeditem, `${nameOfTheItems[index]} (${emojiOfTheItems[index]})`)
      .addField(lang.senditem_embedamount, amount.join(' '))
      .addField(lang.senditem_embedreason, reason.join(' '));

    await msg.client.channels.get('497395598182318100').send({
      embed: infoEmbed
    });

    msg.client.users.fetch(user).then(async (fetchedUser) => {
      if (fetchedUser) {
        await fetchedUser.send({ embed: infoEmbed });
      }
    });

    const set = lang.senditem_set.replace('%amount', amount.join(' ')).replace('%item', `${nameOfTheItems[index]} (${emojiOfTheItems[index]})`).replace('%user', msg.client.users.has(user) ? `${msg.client.users.get(user).tag} (${user})` : user);
    return msg.reply(set);
  }
};
