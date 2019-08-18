const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class randomnumberCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'randomnumber',
      group: 'utility',
      memberName: 'randomnumber',
      description: 'Selects a random number between your input and 1',
      format: 'randomnumber {input}',
      aliases: ['rn'],
      examples: ['randomnumber 100'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const input = parseInt(args.slice().join(' '), 10);
    const randomnumberfinished = Math.floor((Math.random() * input) + 1);

    if (!input) return msg.reply(lang.randomnumber_number);

    const randomnumber = lang.randomnumber_randomnumber.replace('%randomnumber', randomnumberfinished);
    const embed = new Discord.MessageEmbed()
      .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL())
      .setColor('#0066CC')
      .setDescription(randomnumber);
    msg.channel.send({ embed });
  }
};
