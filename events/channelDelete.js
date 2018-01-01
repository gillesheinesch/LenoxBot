const Discord = require('discord.js');
exports.run = (client, channel) => {
    if (channel.type !== 'text') return;

    const tableconfig = client.guildconfs.get(channel.guild.id);
    var lang = require(`../languages/en.json`);
    if (tableconfig.channeldeletelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.channeldeletelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.channeldeleteevent_channeldeleted)
    .addField(`📎 ${lang.channelcreateevent_channelid}:`, channel.id)
    .addField(`📝 ${lang.channelcreateevent_name}:`, channel.name);
    messagechannel.send({ embed: embed });
};
