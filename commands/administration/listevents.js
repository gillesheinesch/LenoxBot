const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class listeventsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'listevents',
      group: 'administration',
      memberName: 'listevents',
      description: 'Lists you all events that you can log on your server',
      format: 'listevents',
      aliases: [],
      examples: ['listevents'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['MANAGE_GUILD'],
      shortDescription: 'Events',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const eventslist = ['Modlog', 'Messagedelete', 'Messageupdate', 'Channelupdate', 'Channelcreate', 'Channeldelete', 'Memberupdate', 'Presenceupdate', 'Rolecreate', 'Roledelete', 'Roleupdate', 'Userjoin', 'Userleft', 'Guildupdate', 'Chatfilter'];

    const embed = new Discord.MessageEmbed()
      .setColor('0066CC')
      .setAuthor(lang.listevents_embed);

    for (let i = 0; i < eventslist.length; i += 1) {
      const x = eventslist[i].toLowerCase();
      embed.addField(eventslist[i], lang[`listevents_${x}`]);
    }

    msg.channel.send({ embed });
  }
};
