const Discord = require('discord.js');
exports.run = async(client, oldGuild, newGuild) => {
    const tableconfig = client.guildconfs.get(oldGuild.id);

    if (!tableconfig.guildupdatelog) {
        tableconfig.guildupdatelog = 'false';
        tableconfig.guildupdatelogchannel = '';
        await client.guildconfs.set(oldGuild.id, tableconfig);
    }
    if (tableconfig.guildupdatelog === 'false') return;
    
    const messagechannel = client.channels.get(tableconfig.guildupdatelogchannel);

    if (oldGuild.name !== newGuild.name) {
        const embed = new Discord.RichEmbed()
        .setColor('#FE2E2E')
        .setTimestamp()
        .setAuthor('Name changed!')
        .addField(`📤 Old Name:`, oldGuild.name)
        .addField(`📥 New Name:`, newGuild.name);
        messagechannel.send({ embed: embed });
    }
};
