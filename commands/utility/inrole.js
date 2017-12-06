const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    if (!args.slice().length >= 1) return msg.channel.send('You have to enter the name of the role!');
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
        msg.channel.send('Please make sure that the role you mentioned exists!');
    }
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'inrole',
	description: 'Command to see which members have a specific role',
	usage: 'inrole {rolename}',
	example: ['inrole Admin'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
