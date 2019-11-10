const Discord = require('discord.js');
const btcValue = require('btc-value');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class bitcoinCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'bitcoin',
      group: 'searches',
      memberName: 'bitcoin',
      description: 'Shows you information from Bitcoin (value and percentage of changes from the last day)',
      format: 'bitcoin',
      aliases: [],
      examples: ['bitcoin'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const value = await btcValue({ isDecimal: true });
    const hourPercentage = await btcValue.getPercentageChangeLastHour();
    const dayPercentage = await btcValue.getPercentageChangeLastDay();
    const weekPercentage = await btcValue.getPercentageChangeLastWeek();

    const descriptionembed = lang.bitcoin_descriptionembed.replace('%value', value).replace('%daypercentage', dayPercentage).replace('%hourpercentage', hourPercentage)
      .replace('%weekpercentage', weekPercentage);

    const embed = new Discord.MessageEmbed()
      .setDescription(descriptionembed)
      .setColor('#ff6600')
      .setAuthor(lang.bitcoin_authorembed);

    msg.channel.send({
      embed
    });
  }
};
