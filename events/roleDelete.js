const Discord = require('discord.js');
exports.run = (client, role) => {
    const tableconfig = client.guildconfs.get(role.guild.id);

	for (var i = 0; i < tableconfig.selfassignableroles.length; i++) {
			if (role.id === tableconfig.selfassignableroles[i]) {
				tableconfig.selfassignableroles.splice(i, 1);
				return client.guildconfs.set(role.guild.id, tableconfig);
			}
		}

    if (tableconfig.roledeletelog === 'true') return;

    const messagechannel = client.channels.get(tableconfig.roledeletelogchannel);

    const embed = new Discord.RichEmbed()
    .setColor('#FE2E2E')
    .setTimestamp()
    .setAuthor('Role deleted!')
    .addField(`📎 RoleID:`, role.id)
    .addField(`🔰 HexColor:`, role.hexColor)
    .addField(`📝 Name:`, role.name);
    messagechannel.send({ embed: embed });
};
