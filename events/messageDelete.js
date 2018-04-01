const Discord = require('discord.js');
exports.run = async(client, msg) => {
    const tableconfig = client.guildconfs.get(msg.guild.id);


    if (tableconfig.messagedellog === 'false') return;
    const messagechannel = client.channels.get(tableconfig.messagedellogchannel);

    if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(msg.id, tableconfig);
    }
    
    var lang = require(`../languages/${tableconfig.language}.json`);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.messagedeleteevent_deleted)
    .addField(`🗣 ${lang.messagedeleteevent_author}`, msg.author.tag)
    .addField(`📲 ${lang.messagedeleteevent_channel}`, `${msg.channel.name} (${msg.channel.id})`)
    .addField(`📎 ${lang.messagedeleteevent_mid}`, msg.id)
    .addField(`📜 ${lang.messagedeleteevent_message}`, msg.cleanContent.length >= 1 ? msg.cleanContent : '-');

    messagechannel.send({ embed: embed });
};
