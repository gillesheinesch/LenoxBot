const Discord = require('discord.js');
exports.run = (client, oldMsg, msg) => {
    const tableconfig = client.guildconfs.get(msg.guild.id);
    if (tableconfig.messageupdatelog === 'false') return;
    const messagechannel = client.channels.get(tableconfig.messageupdatelogchannel);
    if (oldMsg.cleanContent !== msg.cleanContent) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Message updated!')
    .addField(`🗣 Author:`, msg.author.tag)
    .addField(`📲 Channel:`, `#${msg.channel.name} (${msg.channel.id})`)
    .addField(`📎 MessageID:`, msg.id)
    .addField(`📤 Old Message:`, oldMsg.cleanContent)
    .addField(`📥 New Message:`, msg.cleanContent);
    messagechannel.send({ embed: embed });
    }
};
