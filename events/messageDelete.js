const Discord = require('discord.js');
exports.run = (client, msg) => {
    if (client.starboard.get(msg.id)) {
        const table = client.starboard.get(msg.id);
        const starboardch = client.channels.get(table.channel);

        starboardch.fetchMessage(table.msgid).then(m => m.delete());
    }

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
