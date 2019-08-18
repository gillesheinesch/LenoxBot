const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class channeltopicCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'channeltopic',
      group: 'utility',
      memberName: 'channeltopic',
      description: 'Shows you the channel topic of the current channel if one exists',
      format: 'channeltopic',
      aliases: [],
      examples: ['channeltopic'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Information',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    if (msg.channel.topic === null || msg.channel.topic === '') return msg.channel.send(lang.channeltopic_error);

    const embed = new Discord.MessageEmbed()
      .setColor('#99ff99')
      .setDescription(`${lang.channeltopic_embed} \n\n${msg.channel.topic}`)
      .setAuthor(`${msg.channel.name} (${msg.channel.id})`);

    return msg.channel.send({ embed });
  }
};
