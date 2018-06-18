const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);    
    const embed = new Discord.RichEmbed()
    .setFooter(`To add/remove a guild, ?banlistadd/?banlistremove`);
    const tableload = client.botconfs.get('blackbanlist');
    const banlist = [];
    if (tableload.banlist.length < 1) return msg.channel.send('There is no guild in the banlist');
    for (i = 0; i < tableload.banlist.length; i++) {
        const member = msg.guild.member(tableload.banlist[i]);
        banlist.push(member ? `${member.user.tag} (${tableload.banlist[i]})` : tableload.banlist[i]);
    }
    embed.addField('User-Blacklist', banlist.join('\n'));
    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'banlist',
	description: 'Shows you the banlist',
	usage: 'banlist',
	example: ['banlist'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
