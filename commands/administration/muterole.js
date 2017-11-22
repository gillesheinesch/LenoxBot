const Discord = require('discord.js');

exports.run = async(client, msg, args) => {
    const tableload = client.guildconfs.get(msg.guild.id);

    if (args.length < 1) return msg.reply('You forgot to insert the name of the role.');

    const role = msg.guild.roles.find(role => role.name.toLowerCase() === args.slice().join(" "));
    if (!role) return msg.reply('Höh ... This role does not exist at all!').then(m => m.delete(10000));

    if (!tableload.muterole) {
        tableload.muterole = '';
        await client.guildconfs.set(msg.guild.id, tableload);
    }

    tableload.muterole = role.id;
    await client.guildconfs.set(msg.guild.id, tableload);
    msg.channel.send('The muted role was set.');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['m'],
    userpermissions: ['ADMINISTRATOR']
};

exports.help = {
	name: 'muterole',
	description: 'Defines a muted role which muted users will get',
	usage: 'muterole {rolename}',
	example: 'muterole muted',
	category: 'moderation',
    botpermissions: ['SEND_MESSAGES']
};
