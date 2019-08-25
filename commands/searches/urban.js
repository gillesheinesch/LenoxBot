const Discord = require('discord.js');
const snekfetch = require('snekfetch');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class urbanCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'urban',
      group: 'searches',
      memberName: 'urban',
      description: 'Urban dictionary',
      format: 'urban {query}',
      aliases: [],
      examples: ['urban Discord'],
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

    if (!msg.channel.nsfw) return msg.channel.send(lang.pornhubgif_nsfw);
    const content = args.slice().join(' ');
    await snekfetch.get(`http://api.urbandictionary.com/v0/define?term=${content}`)
      .then((r) => {
        const def = r.body.list[0];

        const definition = lang.urban_definition.replace('%word', def.word);
        const embed = new Discord.MessageEmbed()
          .setTitle(`📚 Urban ${lang.urban_embed}`)
          .setThumbnail('https://everythingfat.files.wordpress.com/2013/01/ud-logo.jpg')
          .setColor('#ABCDEF')
          .setDescription(definition + (def.definition.length > 1500 ? `${def.definition.substring(0, 1500)}...` : def.definition))
          .addField(`📃 ${lang.urban_example}`, def.example.length > 1020 ? `${def.example.substring(0, 1020)}...` : def.example, false)
          .addField(`👍 ${lang.urban_thumbsup}`, def.thumbs_up, true)
          .addField(`👎 ${lang.urban_thumbsdown}`, def.thumbs_down, true);

        return msg.channel.send({ embed });
      }).catch(() => msg.channel.send(lang.urban_error));
  }
};
