const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');

module.exports = class removecreditsCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'removecredits',
      group: 'staff',
      memberName: 'removecredits',
      description: 'Removes an user a certain amount of credits',
      format: 'removecredits {@USER} {amount}',
      aliases: [],
      examples: ['removecredits @Monkeyyy11#0001 2000'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Credits',
      dashboardsettings: true,
      cooldown: 300000
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);
    const args = msg.content.split(' ').slice(1);

    const moderatorRole = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'moderator');
    const prmanagerRole = msg.client.guilds.get(settings.botMainDiscordServer).roles.find((r) => r.name.toLowerCase() === 'pr manager');
    if (!moderatorRole || !prmanagerRole) return msg.reply(lang.addrole_rolenotexist);
    if (!msg.member.roles.has(moderatorRole.id) && !msg.member.roles.has(prmanagerRole.id)) return msg.reply(lang.botownercommands_error);

    const user = msg.mentions.users.first() ? msg.mentions.users.first().id : args.slice(0, 1).join(' ');
    const amountofcoins = parseInt(args.slice(1, 2).join(' '), 10);
    const reason = args.slice(2);

    if (!msg.client.users.has(user)) return msg.reply(lang.removecredits_nomention);
    if (!amountofcoins || isNaN(args.slice(1, 2)) || amountofcoins <= 0) return msg.reply(lang.removecredits_novalue);
    if (!reason) return msg.reply(lang.removecredits_noreason);

    let currentCredits = msg.client.provider.getUser(user, 'credits');
    currentCredits -= amountofcoins;
    await msg.client.provider.setUser(user, 'credits', currentCredits);

    const embeddescription = lang.removecredits_embeddescription.replace('%credits', amountofcoins).replace('%user', msg.client.users.has(user) ? msg.client.users.get(user).tag : user);
    const embed = new Discord.MessageEmbed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(embeddescription)
      .addField(lang.removecredits_embedfieldtitle, reason.join(' '))
      .setTimestamp()
      .setColor('RED');
    await msg.client.channels.get('497395598182318100').send({
      embed
    });

    msg.client.users.fetch(user).then(async (fetchedUser) => {
      if (fetchedUser) {
        await fetchedUser.send({ embed });
      }
    });

    const done = lang.removecredits_done.replace('%credits', amountofcoins);
    return msg.reply(done);
  }
};
