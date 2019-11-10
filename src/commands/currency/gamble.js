const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class gambleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'gamble',
      group: 'currency',
      memberName: 'gamble',
      description: 'Enables or disables the dailyremind',
      format: 'gamble',
      aliases: [],
      examples: ['gamble 1000', 'gamble 8344', 'gamble 828', 'gamble 10'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Daily',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const d = Math.random();
    const input = args.slice();

    if (!input || input.length === 0) return msg.reply(lang.gamble_noinput);
    if (isNaN(input)) return msg.reply(lang.gamble_notnumber);
    if (parseInt(input.join(' '), 10) < 10) return msg.reply(lang.gamble_atleast10);
    if (parseInt(input.join(' '), 10) > 1000000) return msg.reply(lang.gamble_gamble_max1million);

    let msgauthortable = msg.client.provider.getUser(msg.author.id, 'credits');
    if (msgauthortable < input.join(' ')) return msg.channel.send(lang.gamble_error);

    if (d < 0.5) {
      const possiblewinrates = ['2', '0.2', '0.3', '0.1', '0.2', '0.3', '0.1', '0.2', '0.3', '0.1', '0.2', '0.3', '0.5', '0.7', '0.9', '1', '1.3', '1.6', '1.9'];
      const result = Math.floor(Math.random() * possiblewinrates.length);
      const finalresult = parseInt(input.join(' ') * possiblewinrates[result], 10);

      msgauthortable += finalresult;
      await msg.client.provider.setUser(msg.author.id, 'credits', msgauthortable);

      const newmsgauthortable = msg.client.provider.getUser(msg.author.id, 'credits');
      const won = lang.gamble_won.replace('%amount', `**${finalresult}**`).replace('%currentcredits', `\`$${newmsgauthortable}\``);

      const embed = new Discord.MessageEmbed()
        .setColor('#44c94d')
        .setDescription(`🎉 ${won}`);

      const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
      currentStats.gamble += 1;
      await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

      const currentGambleRecord = msg.client.provider.getUser(msg.author.id, 'stats');
      if (currentGambleRecord.gamblehighestwin < finalresult) {
        currentGambleRecord.gamblehighestwin = finalresult;
        await msg.client.provider.setUser(msg.author.id, 'stats', currentGambleRecord);
      }

      return msg.channel.send({ embed });
    }
    const result = parseInt(input.join(' '), 10);

    msgauthortable -= result;
    await msg.client.provider.setUser(msg.author.id, 'credits', msgauthortable);

    const newmsgauthortable = msg.client.provider.getUser(msg.author.id, 'credits');
    const lost = lang.gamble_lost.replace('%amount', `**${result}**`).replace('%currentcredits', `\`$${newmsgauthortable}\``);
    const embed = new Discord.MessageEmbed()
      .setColor('#f44242')
      .setDescription(`😥 ${lost}`);

    const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
    currentStats.gamble += 1;
    await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);

    return msg.channel.send({ embed });
  }
};
