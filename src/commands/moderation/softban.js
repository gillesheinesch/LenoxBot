const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class softbanCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'softban',
      group: 'moderation',
      memberName: 'softban',
      description: 'Bans a user and deletes his messages of the last X days. After that, he will be unbaned immediately!',
      format: 'softban @User {days} {reason}',
      aliases: [],
      examples: ['softban @Monkeyyy11#7584 7 Spam'],
      clientpermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
      userpermissions: ['BAN_MEMBERS'],
      shortDescription: 'Ban',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const reason = args.slice(2).join(' ');
    const days = args.slice(1).join(' ');
    const user = msg.mentions.users.first();

    if (!user) return msg.reply(lang.softban_nomention);
    if (user === msg.author) return msg.channel.send(lang.softban_yourself);
    if (!days[0]) return msg.reply(lang.softban_daysundefined);

    const nonumber = lang.softban_nonumber.replace('%user', user.tag);
    if (isNaN(days[0]) === true) return msg.reply(nonumber);
    if (parseInt(days[0], 10) < 1) return msg.reply(lang.softban_min1);
    if (parseInt(days[0], 10) > 8) return msg.reply(lang.softban_max7);
    if (!reason) return msg.reply(lang.softban_noinput);

    if (!msg.guild.member(user).bannable) return msg.reply(lang.softban_nopermission);
    await msg.guild.members.ban(user, { days: days[0] });
    await msg.guild.members.unban(user);

    const softbanned = lang.softban_softbanned.replace('%usertag', user.tag).replace('%days', days[0]);
    const softbanembed = new Discord.MessageEmbed()
      .setColor('#99ff66')
      .setDescription(`✅ ${softbanned}`);
    msg.channel.send({ embed: softbanembed });

    const softbanby = lang.softban_softbanby.replace('%authortag', `${msg.author.username}#${msg.author.discriminator}`);
    const softbandescription = lang.softban_softbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id).replace('%reason', reason)
      .replace('%days', days[0]);
    const embed = new Discord.MessageEmbed()
      .setAuthor(softbanby, msg.author.displayAvatarURL())
      .setThumbnail(user.displayAvatarURL())
      .setColor('#FF0000')
      .setTimestamp()
      .setDescription(softbandescription);

    if (msg.client.provider.getGuild(msg.guild.id, 'modlog') === 'true') {
      const modlogchannel = msg.client.channels.get(msg.client.provider.getGuild(msg.guild.id, 'modlogchannel'));
      modlogchannel.send({ embed });
    }

    const currentPunishments = msg.client.provider.getGuild(msg.guild.id, 'punishments');
    const punishmentConfig = {
      id: currentPunishments.length + 1,
      userId: user.id,
      reason,
      date: Date.now(),
      moderatorId: msg.author.id,
      days: days[0],
      type: 'softban'
    };

    currentPunishments.push(punishmentConfig);
    await msg.client.provider.setGuild(msg.guild.id, 'punishments', currentPunishments);
  }
};
