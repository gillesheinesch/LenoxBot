exports.run = async(client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    const input = args.slice();

    if (!input || input.length === 0) return msg.reply(lang.channelblacklistadd_error);

    try {
        var channel = msg.guild.channels.find(r => r.name.toLowerCase() === input.join(" ").toLowerCase());
    } catch (error) {
        return msg.channel.send(lang.channelblacklistadd_channelnotfind);
    }

    if (channel.type !== 'voice') return msg.reply(lang.channelblacklistadd_wrongtype);

    for (var i = 0; i < tableload.musicchannelblacklist.length; i++) {
        if (tableload.musicchannelblacklist[i] === channel.id) return msg.reply(lang.channelblacklistadd_already);
    }

    const channelid = channel.id;
    
    tableload.musicchannelblacklist.push(channelid);
    await client.guildconfs.set(msg.guild.id, tableload);

    return msg.reply(lang.channelblacklistadd_added);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'channelblacklistadd',
	description: 'Shows you how long the bot needs to send a message',
	usage: 'ping',
	example: ['ping'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
