const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
    if (!args.slice().length >= 1) return msg.channel.send(lang.inrole_noinput);
    try {
        const role = msg.guild.roles.find(r => r.name.toLowerCase() === args.slice().join(' ').toLowerCase());
        var inRole = role.members.array();
        var array = [];
        var inRoleArray = inRole.forEach(function(element){
            array.push(element.user.tag);
        })

        const embed = new Discord.RichEmbed()
        .setDescription(array.join(', '))
        .setColor('#ABCDEF')
        .setAuthor(`${role.name} (${array.length})`);
        msg.channel.send({ embed });
    } catch (error) {
        msg.channel.send(lang.inrole_rolenotexist);
    }
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
	name: 'inrole',
	description: 'Command to see which members have a specific role',
	usage: 'inrole {rolename}',
	example: ['inrole Admin'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
