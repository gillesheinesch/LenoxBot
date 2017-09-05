const Discord = require('discord.js');
exports.run = (client, msg) => {
    const tableconfig = client.guildconfs.get(msg.guild.id);
    if (tableconfig.messagedellog === 'false') return;
    const messagechannel = client.channels.get(tableconfig.messagedellogchannel);
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Message deleted!')
    .addField(`🗣 Author:`, msg.author.tag)
    .addField(`📲 Channel:`, `${msg.channel.name} (${msg.channel.id})`)
    .addField(`📎 MessageID:`, msg.id)
    .addField(`📜 Message:`, msg.cleanContent);
    messagechannel.send({ embed: embed });
};
