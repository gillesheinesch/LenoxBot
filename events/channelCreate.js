const Discord = require('discord.js');
exports.run = (client, channel) => {
    if (channel.type !== 'text') return;

    const tableconfig = client.guildconfs.get(channel.guild.id);
    var lang = require(`../languages/en.json`);
    if (!tableconfig) return;
    if (tableconfig.channelcreatelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.channelcreatelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.channelcreateevent_channelcreated)
    .addField(`📎 ${lang.channelcreateevent_channelid}:`, channel.id)
    .addField(`📝 ${lang.channelcreateevent_name}`, channel.name);
    messagechannel.send({ embed: embed });
};
