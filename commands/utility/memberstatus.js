const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class memberstatusCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'memberstatus',
      group: 'utility',
      memberName: 'memberstatus',
      description: 'Shows you how many members on this Discord server are AFK, online, offline or busy',
      format: 'memberstatus',
      aliases: [],
      examples: ['memberstatus'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Information',
      dashboardsettings: true
    });
  }

  run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const onlinecount = msg.guild.members.array().filter((m) => m.presence.status === 'online').length;
    const offlinecount = msg.guild.members.array().filter((m) => m.presence.status === 'offline').length;
    const dndcount = msg.guild.members.array().filter((m) => m.presence.status === 'dnd').length;
    const afkcount = msg.guild.members.array().filter((m) => m.presence.status === 'idle').length;

    const online = lang.memberstatus_online.replace('%memberscount', onlinecount);
    const dnd = lang.memberstatus_dnd.replace('%memberscount', dndcount);
    const afk = lang.memberstatus_afk.replace('%memberscount', afkcount);
    const offline = lang.memberstatus_offline.replace('%memberscount', offlinecount);
    const embed = new Discord.MessageEmbed()
      .setDescription(`📲 ${online}\
	\n🔴 ${dnd}\
	\n🕗 ${afk}\
	\n📵 ${offline}`)
      .setColor('#99cc00')
      .setAuthor(msg.guild.name, msg.guild.iconURL());

    msg.channel.send({ embed });
  }
};
