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
        .addField(`⏳ Runtime since the last restart`, `${uptimeserver}`)
        .addField(`📡 Statistics about the bot`, `Online on ${client.guilds.size} for ${client.users.size} User`)
        .addField(`🇩🇪 Bot Sprache`, `English`)
        .addField('📤 You want this bot on your server?', `[Invite the Bot](https://sd.keepcalm-o-matic.co.uk/i-w600/keep-calm-i-m-not-ready-yet-3.jpg)`)
        .addField('Join our Discord Server', '[Join our Support Discord Server](https://discord.gg/5mpwCr8)')
        .addField(`👤 Bot Programmer`, `Monkeyyy11#7584`);

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
        example: 'botinfo'
};
