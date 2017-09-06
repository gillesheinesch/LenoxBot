const Discord = require('discord.js');
exports.run = (client, channel) => {
    if (channel.type !== 'text') return;

    const tableconfig = client.guildconfs.get(channel.guild.id);
    if (!tableconfig) return;
    if (tableconfig.channelcreatelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.channelcreatelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Channel created!')
    .addField(`📎 ChannelID:`, channel.id)
    .addField(`📝 Name:`, channel.name);
    messagechannel.send({ embed: embed });
};
