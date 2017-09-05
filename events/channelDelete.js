const Discord = require('discord.js');
exports.run = (client, channel) => {
    if (channel.type !== 'text') return;

    const tableconfig = client.guildconfs.get(channel.guild.id);
    if (tableconfig.channeldeletelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.channeldeletelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Channel deleted!')
    .addField(`📎 ChannelID:`, channel.id)
    .addField(`📝 Name:`, channel.name);
    messagechannel.send({ embed: embed });
};
