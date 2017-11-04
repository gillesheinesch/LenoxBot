exports.run = async(client, msg, args) => {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply('You dont have permissions to execute this command!').then(m => m.delete(10000));
    
    const tableload = client.guildconfs.get(msg.guild.id);
    const content = args.slice().join(" ");
    if (!content) return msg.channel.send('You must enter your welcome message!');
    tableload.welcomemsg = content;
    await client.guildconfs.set(msg.guild.id, tableload);
    
    return msg.channel.send('Welcome message saved successfully!');
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: []
};

exports.help = {
	name: 'welcomemsg',
    description: 'Sets a welcome message to greet your users',
    usage: 'welcomemsg {welcome msg}',
    example: 'welcomemsg Hello $user$, welcome on the $servername$ discord-server!',
	category: 'administration'
};
