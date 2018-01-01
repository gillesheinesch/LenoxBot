const Discord = require('discord.js');
exports.run = async(client, role) => {
    const tableconfig = client.guildconfs.get(role.guild.id);
    var lang = require(`../languages/en.json`);

	for (var i = 0; i < tableconfig.selfassignableroles.length; i++) {
			if (role.id === tableconfig.selfassignableroles[i]) {
				tableconfig.selfassignableroles.splice(i, 1);
                return client.guildconfs.set(role.guild.id, tableconfig);
			}
        }
    if (role.name === 'LenoxBot') return;
    if (tableconfig.roledeletelog === 'false') return;

    const messagechannel = client.channels.get(tableconfig.roledeletelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor(lang.roledeleteevent_deleted)
    .addField(`📎 ${lang.rolecreateevent_id}:`, role.id)
    .addField(`🔰 ${lang.rolecreateevent_color}:`, role.hexColor)
    .addField(`📝 ${lang.rolecreateevent_name}:`, role.name);
    messagechannel.send({ embed: embed });
};
