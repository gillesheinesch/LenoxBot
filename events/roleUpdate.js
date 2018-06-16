const Discord = require('discord.js');
exports.run = (client, oldRole, newRole) => {
    const tableload = client.guildconfs.get(oldRole.guild.id);
    if (!tableload) return;

    if (tableload.rolecreatelog === 'false') return;

    if (tableload.language === '') {
        tableload.language = 'en';
        client.guildconfs.set(oldRole.guild.id, tableload);
    } 

    var lang = require(`../languages/${tableload.language}.json`);

    const messagechannel = client.channels.get(tableload.rolecreatelogchannel);

    if (oldRole.name !== newRole.name) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.roleupdateevent_nameupdated)
    .addField(`📎 ${lang.rolecreateevent_id}:`, oldRole.id)
    .addField(`📤 ${lang.roleupdateevent_oldname}:`, oldRole.name)
    .addField(`📥 ${lang.roleupdateevent_newname}:`, newRole.name);
    return messagechannel.send({ embed: embed });
} 
if (oldRole.hexColor !== newRole.hexColor) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.roleupdateevent_rolecolorupdated)
    .addField(`📎 ${lang.rolecreateevent_id}:`, oldRole.id)
    .addField(`📤${lang.roleupdateevent_oldcolor}:`, oldRole.hexColor)
    .addField(`📥 ${lang.roleupdateevent_newcolor}:`, newRole.hexColor);
    return messagechannel.send({ embed: embed });
} 
if (oldRole.position !== newRole.position) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.roleupdateevent_positionupdated)
    .addField(`📎 ${lang.rolecreateevent_id}:`, oldRole.id)
    .addField(`📤 ${lang.roleupdateevent_old}:`, oldRole.position)
    .addField(`📥 ${lang.roleupdateevent_new}:`, newRole.position);
    return messagechannel.send({ embed: embed });
}
};
