const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class sexvideoCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'sexvideo',
      group: 'nsfw',
      memberName: 'sexvideo',
      description: 'Searches for sex videos',
      format: 'sexvideo {query}',
      aliases: [],
      examples: ['sexvideo ass', 'sexvideo tits'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Videos',
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
      const videos = await Searcher.videos();

      const result = Math.floor(Math.random() * videos.length);

      const { url } = videos[result - 1];
      const thumbnail = videos[result - 1].thumb;
      const { title } = videos[result - 1];
      const { duration } = videos[result - 1];

      const durationembed = lang.sexvideo_durationembed.replace('%duration', duration);
      const embed = new Discord.MessageEmbed()
        .setImage(thumbnail)
        .setURL(url)
        .setDescription(durationembed)
        .setColor('#ff0000')
        .setFooter(url)
        .setURL(url)
        .setAuthor(title);

      return msg.channel.send({
        embed
      });
    }
    catch (error) {
      return msg.reply(lang.pornhubgif_couldfindnothing);
    }
  }
};
