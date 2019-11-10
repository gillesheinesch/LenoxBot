const Discord = require('discord.js');
const request = require('request');
const LenoxCommand = require('../LenoxCommand.js');
const config = require('../../settings.json');

module.exports = class youtubeCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'youtube',
      group: 'searches',
      memberName: 'youtube',
      description: 'Searches for a video on youtube',
      format: 'youtube {input}',
      aliases: ['yt'],
      examples: ['youtube Discord'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    const args = msg.content.split(' ').slice(1);

    if (!args[0]) {
      const noinput = lang.youtube_noinput.replace('%prefix', prefix);
      return msg.channel.send(noinput);
    }
    const url = `https://www.googleapis.com/youtube/v3/search?part=id,snippet&q=${args}&maxResults=1&type=video&key=${config.googlekey}`;
    request(url, (err, response, body) => {
      if (err) {
        msg.client.logger.error(err);
        return msg.channel.send(lang.youtube_error);
      }
      const search = JSON.parse(body);
      try {
        const { title } = search.items[0].snippet;
        const thumbnail = search.items[0].snippet.thumbnails.medium.url;
        const { description } = search.items[0].snippet;
        const newUrl = `https://www.youtube.com/watch?v=${search.items[0].id.videoId}`;
        const embed = new Discord.MessageEmbed()
          .setImage(thumbnail)
          .setAuthor(title)
          .setDescription(description)
          .setURL(newUrl)
          .setColor(0x00AE86)
          .setFooter(newUrl);
        return msg.channel.send({ embed });
      }
      catch (error) {
        return msg.channel.send(lang.youtube_noresult);
      }
    });
  }
};
