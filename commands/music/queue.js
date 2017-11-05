const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    const queue = client.queue;
    const serverQueue = queue.get(msg.guild.id);
if (!serverQueue) return msg.channel.send('There is nothing playing.');
const embed = new Discord.RichEmbed()
.setColor('#009696')
.setDescription(`${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
\n**Now playing:** ${serverQueue.songs[0].title}`)
.setAuthor(`Song queue:`, 'https://cdn.discordapp.com/attachments/355972323590930432/357097120580501504/unnamed.jpg');
return msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    userpermissions: []
};

exports.help = {
	name: 'queue',
	description: 'Shows you the current music-queue',
	usage: 'queue',
	example: 'queue',
	category: 'music',
    botpermissions: ['SEND_MESSAGES']
};
