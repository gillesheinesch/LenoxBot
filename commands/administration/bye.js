exports.run = async(client, msg, args) => {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
    
    const tableload = client.guildconfs.get(msg.guild.id);
    if (tableload.bye === 'false') {
        tableload.bye = 'true';
        const channelid = msg.channel.id;
        tableload.byechannel = channelid;
        msg.channel.send(`Your users are now said goodbye in **${msg.channel.name}**!`);
    } else if (tableload.bye === 'true') {
        tableload.bye = 'false';
        msg.channel.send('The goodbye message is now disabled!');
    }
    await client.guildconfs.set(msg.guild.id, tableload);
    await client.guildconfs.close();
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

exports.help = {
	name: 'bye',
    description: 'Disable the goodbye message',
    usage: 'bye',
    example: 'bye',
	category: 'administration'
};
