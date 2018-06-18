exports.run = async(client, msg, args, lang) => {    
    const tableload = client.guildconfs.get(msg.guild.id);
    if (tableload.bye === 'false') {
        tableload.bye = 'true';
        const channelid = msg.channel.id;
        tableload.byechannel = channelid;

        var channelset = lang.bye_channelset.replace('%channelname', msg.channel.name);
        msg.channel.send(channelset);
    } else if (tableload.bye === 'true') {
        tableload.bye = 'false';
        msg.channel.send(lang.bye_channeldeleted);
    }
    await client.guildconfs.set(msg.guild.id, tableload);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
<<<<<<< HEAD
    userpermissions: ['ADMINISTRATOR']
=======
    userpermissions: ['ADMINISTRATOR'], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};

exports.help = {
	name: 'bye',
    description: 'Disable the goodbye message',
    usage: 'bye',
    example: ['bye'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
