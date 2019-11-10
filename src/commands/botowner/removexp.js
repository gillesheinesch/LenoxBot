const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class removexpCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'removexp',
      group: 'botowner',
      memberName: 'removexp',
      description: '',
      format: 'removexp {userid} {amount}',
      aliases: [],
      examples: ['removexp 327533963923161090 1000'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'xp',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);
    const userId = msg.mentions.users.first() ? msg.mentions.users.first().id : msg.mentions.users.first() || args.slice(0, 1).join(' ');
    const xpAmount = parseInt(args.slice(1, 2).join(' '), 10);

    if (args.slice(1, 2).length === 0) return msg.reply(lang.removexp_noamount);
    if (isNaN(xpAmount)) return msg.reply(lang.removexp_amountnan);
    if (xpAmount <= 0) return msg.reply(lang.removexp_atleast1);

    const currentScores = msg.client.provider.getGuild(msg.guild.id, 'scores');
    if (currentScores[userId]) {
      currentScores[userId].points -= xpAmount;
    }
    else {
      currentScores[userId] = {
        points: 0,
        level: 0
      };
    }

    const curLevel = Math.floor(0.3 * Math.sqrt(currentScores[userId].points + 1));
    if (curLevel > currentScores[userId].level) {
      currentScores[userId].level = curLevel;

      if (msg.client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
        const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[userId].level);
        msg.channel.send(levelup);
      }
    }
    if (curLevel < currentScores[userId].level) {
      currentScores[userId].level = curLevel;

      if (msg.client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
        const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[userId].level);
        msg.channel.send(levelup);
      }
    }

    await msg.client.provider.setGuild(msg.guild.id, 'scores', currentScores);


    return msg.reply(lang.removexp_done);
  }
};
