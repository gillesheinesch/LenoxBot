const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');
const keygenerator = require('../../utils/keygenerator.js');

module.exports = class createuserkeyCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'createuserkey',
      group: 'botowner',
      memberName: 'createuserkey',
      description: 'Creates a premium userkey',
      format: 'createuserkey',
      aliases: [],
      examples: ['createuserkey'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'General',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const Discord = require('discord.js');
    if (!settings.owners.includes(msg.author.id) && !settings.administrators.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

    let key = '';

    for (let i = 0; i < 1000; i += 1) {
      key = keygenerator.generateKey();

      if (!msg.client.provider.getBotsettings('botconfs', 'premium').keys.userkeys.includes(key)) {
        break;
      }

      if (i === 999) {
        key = undefined;
      }
    }

    if (key !== undefined) {
      const currentPremium = msg.client.provider.getBotsettings('botconfs', 'premium');
      currentPremium.keys.userkeys.push(key);
      await msg.client.provider.setBotsettings('botconfs', 'premium', currentPremium);
    }

    const embeddescription = lang.createuserkey_embeddescription.replace('%premiumcode', key);
    const embed = new Discord.MessageEmbed()
      .setDescription(embeddescription)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setTimestamp()
      .setColor('#cc99ff')
      .setTitle(lang.createuserkey_embedtitle);
    await msg.client.channels.get(settings.keychannel).send({ embed });

    msg.reply(lang.createuserkey_message);
  }
};
