const DiscordCommando = require('discord.js-commando');
const Discord = require('discord.js');

module.exports = class LenoxCommand extends DiscordCommando.Command {
  constructor(client, info) {
    super(client, info);
    this.shortDescription = info.shortDescription || null;
    this.cooldown = info.cooldown || null;
    this.dashboardsettings = info.dashboardsettings || null;
    this.clientpermissions = info.clientpermissions || [];
    this.userpermissions = info.userpermissions || [];
  }

  onError(err, message, args, fromPattern, result) { // eslint-disable-line no-unused-vars
    console.error(err);
    const embed = new Discord.MessageEmbed()
      .setColor('RED')
      .setTimestamp()
      .setTitle('Please report this on our Discord server https://lenoxbot.com/discord')
      .setDescription(`StackTrace: \n\`\`\`${err.stack}\`\`\``)
      .addField('Command:', `${message.content.split(' ').join(' ')}`);

    return message.reply({ embed });
  }
};
