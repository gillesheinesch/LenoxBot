const LenoxCommand = require('../LenoxCommand.js');

module.exports = class creditstoxpCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'creditstoxp',
      group: 'currency',
      memberName: 'creditstoxp',
      description: '',
      format: 'creditstoxp {amount}',
      aliases: ['ctxp'],
      examples: ['creditstoxp 1000'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Credits',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const creditsAmount = args.slice(0, 1);

    if (isNaN(creditsAmount)) return msg.reply(lang.creditstoxp_nan);
    if (Number(creditsAmount) <= 0) return msg.reply(lang.creditstoxp_under1);

    const creditsTableOfTheUser = msg.client.provider.getUser(msg.author.id, 'credits');
    if (creditsTableOfTheUser < parseInt(creditsAmount, 10)) return msg.channel.send(lang.creditstoxp_nocredits);

    let newCreditsCount = msg.client.provider.getUser(msg.author.id, 'credits');
    newCreditsCount -= parseInt(creditsAmount, 10);

    await msg.client.provider.setUser(msg.author.id, 'credits', newCreditsCount);

    const currentScores = msg.client.provider.getGuild(msg.guild.id, 'scores');
    if (currentScores[msg.author.id]) {
      currentScores[msg.author.id].points += Math.round(parseInt(creditsAmount, 10) / 2);
    }
    else {
      currentScores[msg.author.id] = {
        points: 0,
        level: 0
      };
    }

    const curLevel = Math.floor(0.3 * Math.sqrt(currentScores[msg.author.id].points + 1));
    if (curLevel > currentScores[msg.author.id].level) {
      currentScores[msg.author.id].level = curLevel;

      if (msg.client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
        const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[msg.author.id].level);
        msg.channel.send(levelup);
      }
    }
    if (curLevel < currentScores[msg.author.id].level) {
      currentScores[msg.author.id].level = curLevel;

      if (msg.client.provider.getGuild(msg.guild.id, 'xpmessages') === 'true') {
        const levelup = lang.messageevent_levelup.replace('%author', msg.author).replace('%level', currentScores[msg.author.id].level);
        msg.channel.send(levelup);
      }
    }

    for (let i = 1; i < msg.client.provider.getGuild(msg.guild.id, 'ara').length; i += 2) {
      if (msg.client.provider.getGuild(msg.guild.id, 'ara')[i] < currentScores[msg.author.id].points && !msg.member.roles.get(msg.client.provider.getGuild(msg.guild.id, 'ara')[i - 1])) {
        const role = msg.guild.roles.get(msg.client.provider.getGuild(msg.guild.id, 'ara')[i - 1]);
        if (!role) break;
        msg.member.roles.add(role);

        const automaticrolegotten = lang.messageevent_automaticrolegotten.replace('%rolename', role.name);
        msg.channel.send(automaticrolegotten);
      }
    }
    await msg.client.provider.setGuild(msg.guild.id, 'scores', currentScores);

    const done = lang.creditstoxp_done.replace('%credits', `**${creditsAmount}**`).replace('%xp', `**${Math.round(parseInt(creditsAmount, 10) / 2)}**`);
    return msg.reply(done);
  }
};
