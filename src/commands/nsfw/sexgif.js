const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class sexgifCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'sexgif',
      group: 'nsfw',
      memberName: 'sexgif',
      description: 'Searches for sex gifs',
      format: 'sexgif {query}',
      aliases: [],
      examples: ['sexgif ass', 'sexgif tits'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'GIFS',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (!msg.channel.nsfw) return msg.channel.send(lang.pornhubgif_nsfw);
    if (args.length === 0) return msg.channel.send(lang.pornhubgif_type);
    const Pornsearch = require('pornsearch');

    try {
      /* eslint no-undef: 0 */
      const Searcher = new Pornsearch(args.join(' '), 'sex');
      const gifs = await Searcher.gifs();

      const result = Math.floor(Math.random() * gifs.length);

      const { url } = gifs[result - 1];

      const embed = new Discord.MessageEmbed()
        .setImage(url)
        .setColor('#ff0000')
        .setURL(url)
        .setAuthor(url);

      return msg.channel.send({
        embed
      });
    }
    catch (error) {
      return msg.reply(lang.pornhubgif_couldfindnothing);
    }
  }
};
