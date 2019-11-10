const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class rankCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'rank',
      group: 'utility',
      memberName: 'rank',
      description: 'Displays the points of you or a user',
      format: 'rank [@User]',
      aliases: [],
      examples: ['rank', 'rank @Monkeyyy11'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'XP',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const user1 = msg.mentions.users.first() || msg.author;
    const embed = new Discord.MessageEmbed()
      .setColor('#A4F2DF')
      .setThumbnail(user1.avatarURL())
      .setAuthor(user1.tag, user1.avatarURL());

    let allMembersArray = [];
    let rank = 0;

    const scoresOfAllMembers = await msg.client.provider.getGuild(msg.guild.id, 'scores');
    /* eslint guard-for-in: 0 */
    for (const key in scoresOfAllMembers) {
      const settings = {
        userId: key,
        points: scoresOfAllMembers[key].points
      };
      if (settings.userId !== 'global') {
        allMembersArray.push(settings);
      }
    }

    allMembersArray = allMembersArray.sort((a, b) => {
      if (a.points < b.points) {
        return 1;
      }
      if (a.points > b.points) {
        return -1;
      }
      return 0;
    });

    for (let i = 0; i < allMembersArray.length; i += 1) {
      if (allMembersArray[i].userId === user1.id) {
        rank = i + 1;
      }
    }
    const row = await msg.client.provider.getGuild(msg.guild.id, 'scores')[user1.id];
    if (!row || row.points === 0) return msg.reply(lang.rank_noleaderboard);

    embed.addField(lang.rank_points, row.points, true);
    embed.addField(lang.rank_level, row.level, true);
    embed.addField(lang.rank_rank, `${rank}/${allMembersArray.length}`);

    return msg.channel.send({ embed });
  }
};
