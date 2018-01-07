const Discord = require('discord.js');
exports.run = (client, channel) => {
    if (channel.type !== 'text') return;

    const tableconfig = client.guildconfs.get(channel.guild.id);
    if (!tableconfig) return;
    if (tableconfig.channelcreatelog === 'false') return;

    if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(channel.guild.id, tableconfig);
	}

    var lang = require(`../languages/${tableconfig.language}.json`);

    const messagechannel = client.channels.get(tableconfig.channelcreatelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.channelcreateevent_channelcreated)
    .addField(`📎 ${lang.channelcreateevent_channelid}:`, channel.id)
    .addField(`📝 ${lang.channelcreateevent_name}`, channel.name);
    messagechannel.send({ embed: embed });
};
