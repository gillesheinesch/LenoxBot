const Discord = require('discord.js');
exports.run = (client, oldChannel, newChannel) => {
    if (newChannel.type !== 'text' || oldChannel.type !== 'text') return;

    const tableconfig = client.guildconfs.get(newChannel.guild.id);
    if (tableconfig.channelupdatelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.channelupdatelogchannel);

    if (oldChannel.name !== newChannel.name) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Channelname updated!')
    .addField(`📎 ChannelID:`, oldChannel.id)
    .addField(`📤 Old Name:`, oldChannel.name)
    .addField(`📥 New Name:`, newChannel.name);
    return messagechannel.send({ embed: embed });
} else if (oldChannel.topic !== newChannel.topic) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Channeltopic updated!')
    .addField(`📎 ChannelID:`, oldChannel.id)
    .addField(`📤 Old Topic:`, oldChannel.topic)
    .addField(`📥 New Topic:`, newChannel.topic);
    return messagechannel.send({ embed: embed });
} else if (oldChannel.position !== newChannel.position) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Channelposition updated!')
    .addField(`📎 ChannelID:`, oldChannel.id)
    .addField(`📤 Old Position:`, oldChannel.position)
    .addField(`📥 New Position:`, newChannel.position);
    return messagechannel.send({ embed: embed });
}
};
