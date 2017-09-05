const Discord = require('discord.js');
exports.run = (client, oldMember, newMember) => {
    const tableconfig = client.guildconfs.get(newMember.guild.id);
    if (tableconfig.guildmemberupdatelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.guildmemberupdatelogchannel);
if (oldMember.nickname !== newMember.nickname) {
    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Nickname changed!')
    .addField(`📎 Member:`, `${oldMember.user.tag} (${oldMember.id})`)
    .addField(`📤 Old Nickname:`, oldMember.nickname === null ? 'The member had no nickname' : oldMember.nickname)
    .addField(`📥 New Nickname:`, newMember.nickname === null ? 'The nickname has been reset' : newMember.nickname);
    messagechannel.send({ embed: embed });
}
};
