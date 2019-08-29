const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class setstreakCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'setstreak',
      group: 'staff',
      memberName: 'setstreak',
      description: 'Gives a user a daily streak',
      format: 'setstreak {@User/userid} {streak} {reason}',
      aliases: [],
      examples: ['setstreak 352896116812939264 12 Bug'],
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

    let oldstreak;

    if (!settings.owners.includes(msg.author.id) && !settings.administrators.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

    const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args.slice(0, 1).join(' ');
    if (!user) return msg.reply(lang.setstreak_nomention);

    const streak = args.slice(1, 2);
    if (!streak || !streak.length) return msg.reply(lang.setstreak_nostreak);
    if (isNaN(streak) || streak <= 0) return msg.reply(lang.setstreak_higherthan0);

    const reason = args.slice(2, 3);
    if (!reason || !reason.length) return msg.reply(lang.setstreak_noreason);

    if (!msg.client.provider.getUser(user, 'credits')) return msg.reply(lang.setstreak_notexist);

    const currentDailystreak = msg.client.provider.getUser(user, 'dailystreak');
    oldstreak = currentDailystreak.streak;

    if (oldstreak === parseInt(streak.join(' '), 10)) return msg.reply(lang.setstreak_samestreak);

    currentDailystreak.streak = parseInt(streak.join(' '), 10);
    currentDailystreak.lastpick = Date.now();
    currentDailystreak.deadline = Date.now() + 172800000;
    await msg.client.provider.setUser(user, 'dailystreak', currentDailystreak);

    const infoEmbed = new Discord.MessageEmbed()
      .setTimestamp()
      .setColor('BLUE')
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(lang.setstreak_setembed)
      .addField(lang.setstreak_embedfielduser, msg.client.users.has(user) ? `${msg.client.users.get(user).tag} (${user})` : user)
      .addField(lang.setstreak_embedfieldoldstreak, oldstreak)
      .addField(lang.setstreak_embedfieldnewstreak, streak.join(' '))
      .addField(lang.setstreak_embedfieldreason, reason.join(' '));

    await msg.client.channels.get('497395598182318100').send({
      embed: infoEmbed
    });

    msg.client.users.fetch(user).then(async (fetchedUser) => {
      if (fetchedUser) {
        await fetchedUser.send({ embed: infoEmbed });
      }
    });

    return msg.reply(lang.setstreak_set);
  }
};
