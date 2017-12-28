const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
exports.run = (client, msg, args) => {
	const uptimeserver = moment.duration(client.uptime).format('d[ days], h[ hours], m[ minutes and ]s[ seconds]');
	const embed = new Discord.RichEmbed()
        .setAuthor('LenoxBot', client.user.avatarURL)
        .setColor('#0066CC')
        .setThumbnail(client.user.avatarURL)
        .addField(`⏳ Runtime since the last restart`, `${uptimeserver}`, true)
        .addField('🛠 Memory usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
        .addField(`📡 Statistics about the bot`, `Online on ${client.guilds.size} guilds for ${client.users.size} User`)
        .addField('💻 Documentation', `https://www.monkeyyy11.de/`)
        .addField(`💎 Support us!`, `https://www.patreon.com/lenoxbot`)
        .addField('📤 You want this bot on your server?', `https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8`)
        .addField('📢 Join our Discord Server', 'https://discord.gg/5mpwCr8');

	msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['binfo', 'bi'],
        userpermissions: []
};
exports.help = {
	name: 'botinfo',
	description: 'Information about the bot',
        usage: 'botinfo',
        example: ['botinfo'],
	category: 'utility',
        botpermissions: ['SEND_MESSAGES']
};
