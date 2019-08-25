const Discord = require('discord.js');
const Fortnite = require('fortnite');
const LenoxCommand = require('../LenoxCommand.js');

const fortniteclient = new Fortnite('f00bb1ee-0be8-4474-bbf4-58a382e3245d');

module.exports = class fortniteCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'fortnite',
      group: 'searches',
      memberName: 'fortnite',
      description: 'Shows you Fortnite stats about a player on every console',
      format: 'fortnite {pc, xbl, psn} {EpicGames Username}',
      aliases: [],
      examples: ['fortnite psn Monkeyyy11ez'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const input = args.slice();

    if (!input || input.length === 0) return msg.reply(lang.fortnite_noinput);
    if (input.length < 1) return msg.reply(lang.fortnite_invalidconsole);
    if (input[0].toLowerCase() !== 'pc' && input[0].toLowerCase() !== 'psn' && input[0].toLowerCase() !== 'xbl') return msg.reply(lang.fortnite_invalidconsole);

    let stats;
    try {
      stats = await fortniteclient.getInfo(args.slice(1).join(' '), input[0]);
    }
    catch (error) {
      return msg.reply(lang.fortnite_playernotfound);
    }

    const statsEmbed = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setAuthor(`${stats.username} || ${stats.platformNameLong}`);

    for (let i = 0; i < stats.lifetimeStats.length; i += 1) {
      const { stat } = stats.lifetimeStats[i];
      const { value } = stats.lifetimeStats[i];
      statsEmbed.addField(stat, value, true);
    }

    return msg.channel.send({
      embed: statsEmbed
    });
  }
};
