const Discord = require('discord.js');
exports.run = (client, oldRole, newRole) => {
    const tableconfig = client.guildconfs.get(oldRole.guild.id);
    if (tableconfig.rolecreatelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.rolecreatelogchannel);

    if (oldRole.name !== newRole.name) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Rolename updated!')
    .addField(`📎 RoleID:`, oldRole.id)
    .addField(`📤 Old Name:`, oldRole.name)
    .addField(`📥 New Name:`, newRole.name);
    return messagechannel.send({ embed: embed });
} else if (oldRole.hexColor !== newRole.hexColor) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Rolecolor updated!')
    .addField(`📎 RoleID:`, oldRole.id)
    .addField(`📤 Old HexColor:`, oldRole.hexColor)
    .addField(`📥 New HexColor:`, newRole.hexColor);
    return messagechannel.send({ embed: embed });
} else if (oldRole.position !== newRole.position) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Roleposition updated!')
    .addField(`📎 RoleID:`, oldRole.id)
    .addField(`📤 Old Position:`, oldRole.position)
    .addField(`📥 New Position:`, newRole.position);
    return messagechannel.send({ embed: embed });
}
};
