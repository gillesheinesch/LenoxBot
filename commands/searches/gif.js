const Discord = require('discord.js');
const got = require('got');
const LenoxCommand = require('../LenoxCommand.js');

const API_KEY = 'dc6zaTOxFJmzC';

module.exports = class gifCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'gif',
      group: 'searches',
      memberName: 'gif',
      description: 'Searches for a gif',
      format: 'gif {query}',
      aliases: [],
      examples: ['gif Discord', 'gif Fortnite'],
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
      return msg.channel.send(lang.gif_noinput);
    }

    const res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${encodeURIComponent(args.join(' '))}`, {
      json: true
    });

    if (!res.body.data.image_url) {
      return msg.channel.send(lang.gif_error);
    }

    const embed = new Discord.MessageEmbed()
      .setImage(`${res.body.data.image_url}`)
      .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL())
      .setColor('#0066CC');
    msg.channel.send({
      embed
    });
  }
};
