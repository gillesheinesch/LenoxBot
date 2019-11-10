const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class announceCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'announce',
      group: 'administration',
      memberName: 'announce',
      description: 'Write a new server announcement',
      format: 'announce {announcement text (-embed)}',
      aliases: ['a'],
      examples: ['announce Today we reached 5000 members. Thank you for that!', 'announce Today we reached 5000 members. Thank you for that! -embed'],
      category: 'administration',
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: ['ADMINISTRATOR'],
      shortDescription: 'Announcements',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const prefix = msg.client.provider.getGuild(msg.guild.id, 'prefix');
    const args = msg.content.split(' ').slice(1);

    const text = args.slice().join(' ');
    const embedCheck = text.toLowerCase().includes('-embed');

    const announceactivated = lang.announce_announcedeactivated.replace('%prefix', prefix);
    if (msg.client.provider.getGuild(msg.guild.id, 'announce') === 'false') return msg.channel.send(announceactivated);

    if (!text) return msg.channel.send(lang.annnounce_noinput);

    const announcechannel = msg.client.provider.getGuild(msg.guild.id, 'announcechannel');
    const announcement = lang.announce_announcement.replace('%authortag', msg.author.tag);
    if (embedCheck) {
      const newText = text.replace('-embed', '');
      const embed = new Discord.MessageEmbed()
        .setColor('#33cc33')
        .setDescription(newText)
        .setAuthor(announcement);
      await msg.client.channels.get(announcechannel).send({
        embed
      });
    }
    else {
      await msg.client.channels.get(announcechannel).send(`${announcement} ${text}`);
    }

    return msg.reply(lang.announce_annoucementsent);
  }
};
