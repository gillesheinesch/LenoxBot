exports.run = (client, msg, args) => {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));	
    
    const tableload = client.guildconfs.get(msg.guild.id);
    if (tableload.welcome === 'false') {
        tableload.welcome = 'true';
    
        const channelid = msg.channel.id;
        tableload.welcomechannel = channelid;
    
        msg.channel.send(`Your new users are now welcomed in **${msg.channel.name}**!`);
    } else if (tableload.welcome === 'true') {
        tableload.welcome = 'false';
        msg.channel.send('The welcome message is now disabled!');
    }
    client.guildconfs.set(msg.guild.id, tableload);
    client.guildconfs.close();
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

exports.help = {
	name: 'welcome',
    description: 'Toggles the welcome message in this channel',
    usage: 'welcome',
    example: 'welcome',
	category: 'administration'
};
