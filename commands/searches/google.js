const Discord = require('discord.js');
const request = require('request-promise');
const LenoxCommand = require('../LenoxCommand.js');
const config = require('../../settings.json').googleKey;
const config2 = require('../../settings.json').googlekey;

module.exports = class googleCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'google',
      group: 'searches',
      memberName: 'google',
      description: 'Searches something on google',
      format: 'google {query}',
      aliases: ['g'],
      examples: ['google Discord'],
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

    if (args.length < 1) {
      return msg.reply(lang.google_noinput);
    }

    const filter = ['porno', 'xnxx', 'pornhub', 'porn', 'livesex', 'nsfw'];

    for (let i = 0; i < filter.length; i += 1) {
      if (args.includes(filter[i])) return msg.channel.send(lang.google_nsfw);
    }

    const response = await request({
      headers: { 'User-Agent': 'Mozilla/5.0' },
      uri: 'https://www.googleapis.com/customsearch/v1',
      json: true,
      qs: {
        cx: config,
        key: config2,
        num: 1,
        q: args.join(' ')
      }
    }).catch((error) => console.error(error.response.body.error, msg.channel));

    if (!response) return false;

    if (response.searchInformation.totalResults !== '0') {
      const result = response.items[0];
      const link = decodeURIComponent(result.link);

      const embed = new Discord.MessageEmbed()
        .setColor('#0066CC')
        .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL())
        .setURL(link)
        .setTitle(result.title)
        .setDescription(result.snippet)
        .setFooter(result.link, result.link);

      if (result.pagemap && result.pagemap.cse_thumbnail) embed.setThumbnail(result.pagemap.cse_thumbnail[0].src);

      return msg.channel.send({ embed });
    }
  }
};
