exports.run = async(client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    if (tableload.modlog === 'false' && tableload.messagedellog === 'false' && tableload.messageupdatelog === 'false' && tableload.channelupdatelog === 'false' && tableload.channelcreatelog === 'false' && tableload.channeldeletelog === 'false' && tableload.guildmemberupdatelog === 'false' && tableload.presenceupdatelog === 'false' && tableload.welcomelog === 'false' && tableload.byelog === 'false' && tableload.rolecreatelog === 'false' && tableload.roledeletelog === 'false' && tableload.roleupdatelog === 'false') return msg.channel.send(lang.deleteevents_noactiveevents);
    
    if (tableload.modlog === 'true') {
        tableload.modlog = 'false';
    }

    if (tableload.messagedeletelog === 'true') {
        tableload.messagedeletelog = 'false';
    }

    if (tableload.messageupdatelog === 'true') {
        tableload.messageupdatelog = 'false';
    }

    if (tableload.channelupdatelog === 'true') {
        tableload.channelupdatelog = 'false';
    }

    if (tableload.channelcreatelog === 'true') {
        tableload.channelcreatelog = 'false';
    }

    if (tableload.channeldeletelog === 'true') {
        tableload.channeldeletelog = 'false';
    }

    if (tableload.guildmemberupdatelog === 'true') {
        tableload.guildmemberupdatelog = 'false';
    }

    if (tableload.presenceupdatelog === 'true') {
        tableload.presenceupdatelog = 'false';
    }

    if (tableload.welcomelog === 'true') {
        tableload.welcomelog = 'false';
    }

    if (tableload.byelog === 'true') {
        tableload.byelog = 'false';
    }

    if (tableload.rolecreatelog === 'true') {
        tableload.rolecreatelog = 'false';
    }

    if (tableload.roledeletelog === 'true') {
        tableload.roledeletelog = 'false';
    }

    if (tableload.roleupdatelog === 'true') {
        tableload.roleupdatelog = 'false';
    }

    if (tableload.guildupdatelog === 'true') {
        tableload.guildupdatelog = 'false';
    }

    await client.guildconfs.set(msg.guild.id, tableload);
    
    return msg.channel.send(lang.deleteevents_eventsdisabled);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['delev'],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'deleteevents',
	description: 'Delete all active events on this server',
	usage: 'delevents',
	example: ['delevents'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
