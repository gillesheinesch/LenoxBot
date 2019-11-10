const LenoxCommand = require('../LenoxCommand.js');

const slotThing = [':grapes:', ':tangerine:', ':pear:', ':cherries:'];
const Discord = require('discord.js');

module.exports = class slotCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'slot',
      group: 'currency',
      memberName: 'slot',
      description: 'Play a round with the slot machine',
      format: 'slot',
      aliases: [],
      examples: ['slot'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const msgauthortable = msg.client.provider.getUser(msg.author.id, 'credits');
    if (msgauthortable < 50) return msg.channel.send(lang.slot_error);

    const slotOne = slotThing[Math.floor(Math.random() * slotThing.length)];
    const slotTwo = slotThing[Math.floor(Math.random() * slotThing.length)];
    const slotThree = slotThing[Math.floor(Math.random() * slotThing.length)];
    if (slotOne === slotTwo && slotOne === slotThree) {
      const embed1 = new Discord.MessageEmbed()
        .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
        .setColor('GREEN')
        .addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_triple);
      msg.channel.send({ embed: embed1 });

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += 100;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);
    }
    else
    if (slotOne === slotTwo || slotTwo === slotThree) {
      const embed3 = new Discord.MessageEmbed()
        .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
        .setColor('GREEN')
        .addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_double);
      msg.channel.send({ embed: embed3 });

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += 25;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);
    }
    else {
      const embed2 = new Discord.MessageEmbed()
        .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
        .setColor('RED')
        .addField(`${slotOne}|${slotTwo}|${slotThree}`, lang.slot_nothing);
      msg.channel.send({ embed: embed2 });

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits -= 50;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);
    }

    const currentStats = msg.client.provider.getUser(msg.author.id, 'stats');
    currentStats.slot += 1;
    await msg.client.provider.setUser(msg.author.id, 'stats', currentStats);
  }
};
