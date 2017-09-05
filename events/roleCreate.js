const Discord = require('discord.js');
exports.run = (client, role) => {
    const tableconfig = client.guildconfs.get(role.guild.id);
    if (tableconfig.rolecreatelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.rolecreatelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Role created!')
    .addField(`📎 RoleID:`, role.id)
    .addField(`🔰 HexColor:`, role.hexColor)
    .addField(`📝 Name:`, role.name);
    messagechannel.send({ embed: embed });
};
