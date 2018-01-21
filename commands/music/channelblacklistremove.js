exports.run = async(client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    const input = args.slice();

    if (!input || input.length === 0) return msg.reply(lang.channelblacklistremove_error);

    try {
        var channel = msg.guild.channels.find(r => r.name.toLowerCase() === input.join(" ").toLowerCase());
    } catch (error) {
        return msg.channel.send(lang.channelblacklistadd_channelnotfind);
    }

    if (channel.type !== 'voice') return msg.reply(lang.channelblacklistremove_wrongtype);

    for (var i = 0; i < tableload.musicchannelblacklist.length; i++) {
        if (channel.id === tableload.musicchannelblacklist[i]) {
            tableload.musicchannelblacklist.splice(i, 1);
            await client.guildconfs.set(msg.guild.id, tableload);
            return msg.reply(lang.channelblacklistremove_removed);
        }
    }

    return msg.reply(lang.channelblacklistremove_channelnotblacklisted);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	userpermissions: []
};

exports.help = {
	name: 'channelblacklistremove',
	description: 'Shows you how long the bot needs to send a message',
	usage: 'ping',
	example: ['ping'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
