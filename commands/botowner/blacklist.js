const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);    
    const embed = new Discord.RichEmbed()
    .setFooter(`To add/remove a user, ?blacklistadd/?blacklistremove`);
    const tableload = client.botconfs.get('blackbanlist');
    const blacklist = [];
    if (tableload.blacklist.length < 1) return msg.channel.send('There is no user in the blacklist');
    for (i = 0; i < tableload.blacklist.length; i++) {
        const member = msg.guild.member(tableload.blacklist[i]);
        blacklist.push(member ? `${member.user.tag} (${tableload.blacklist[i]})` : tableload.blacklist[i]);
    }
    embed.addField('User-Blacklist', blacklist.join('\n'));
    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'blacklist',
	description: 'Shows you the blacklist',
	usage: 'blacklist',
	example: ['blacklist'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
};
