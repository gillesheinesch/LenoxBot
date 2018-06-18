exports.run = async(client, msg, args, lang) => {    
    const tableload = client.guildconfs.get(msg.guild.id);
    const content = args.slice().join(" ");

    if (!content) return msg.channel.send(lang.welcomemsg_error);

    tableload.welcomemsg = content;
    await client.guildconfs.set(msg.guild.id, tableload);

    return msg.channel.send(lang.welcomemsg_set);
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
	name: 'welcomemsg',
    description: 'Sets a welcome message to greet your users',
    usage: 'welcomemsg {welcome msg}',
    example: ['welcomemsg Hello $username$, welcome on the $servername$ discord-server!'],
	category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
