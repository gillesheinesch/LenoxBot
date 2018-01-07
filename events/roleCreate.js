const Discord = require('discord.js');
exports.run = (client, role) => {
    const tableconfig = client.guildconfs.get(role.guild.id);
    if (tableconfig.rolecreatelog === 'false') return;

    if (tableconfig.language === '') {
        tableconfig.language = 'en';
        client.guildconfs.set(role.guild.id, tableconfig);
	}

    var lang = require(`../languages/${tableconfig.language}.json`);

    const messagechannel = client.channels.get(tableconfig.rolecreatelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.rolecreateevent_created)
    .addField(`📎 ${lang.rolecreateevent_id}:`, role.id)
    .addField(`🔰 ${lang.rolecreateevent_color}:`, role.hexColor)
    .addField(`📝 ${lang.rolecreateevent_name}:`, role.name);
    messagechannel.send({ embed: embed });
};
