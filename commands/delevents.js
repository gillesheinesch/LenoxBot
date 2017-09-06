exports.run = (client, msg, args) => {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
    const tableload = client.guildconfs.get(msg.guild.id);
    if (tableload.modlog === 'false' && tableload.messagedellog === 'false' && tableload.messageupdatelog === 'false' && tableload.channelupdatelog === 'false' && tableload.channelcreatelog === 'false' && tableload.channeldeletelog === 'false' && tableload.guildmemberupdatelog === 'false' && tableload.presenceupdatelog === 'false' && tableload.welcomelog === 'false' && tableload.byelog === 'false' && tableload.rolecreatelog === 'false' && tableload.roledeletelog === 'false' && tableload.roleupdatelog === 'false') return msg.channel.send('There are no active events!');
    
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

    client.guildconfs.set(msg.guild.id, tableload);
    msg.channel.send('If any events were enabled, they are now disabled!');
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['actev']
};
exports.help = {
	name: 'delevents',
	description: 'Delete all active events/logs on this server',
	usage: 'delevents',
	example: 'delevents',
	category: 'administration'
};
