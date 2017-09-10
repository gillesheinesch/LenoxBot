const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
exports.run = (client, msg, args) => {
	const uptimeserver = moment.duration(client.uptime).format('d[ days], h[ hours], m[ minutes and ]s[ seconds]');
	const embed = new Discord.RichEmbed()
        .setAuthor('LenoxBot', client.user.avatarURL)
        .setColor('#0066CC')
        .setThumbnail(client.user.avatarURL)
        .setFooter('LenoxBot informations & statistics')
        .addField(`⏳ Runtime since the last restart`, `${uptimeserver}`, true)
        .addField('🛠 Memory usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField(`📡 Statistics about the bot`, `Online on ${client.guilds.size} guilds for ${client.users.size} User`)
        .addField(`📚 Bot language`, `English`)
        .addField('📤 You want this bot on your server?', `[Invite the Bot](https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8)`)
        .addField('📢 Join our Discord Server', '[Discord Server](https://discord.gg/5mpwCr8)');

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['bi']
};
exports.help = {
	name: 'botinfo',
	description: 'Information about the bot',
        usage: 'botinfo',
        example: 'botinfo',
	category: 'utility'
};
