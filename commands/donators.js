const Discord = require('discord.js');
exports.run = (client, msg, args) => {
    const tableload = client.botconfs.get('donators');

    if (tableload.donators.length < 1) return msg.reply('There are no donators who support this project!');

    const embed = new Discord.RichEmbed()
    .setColor('#77f442')
    .setAuthor('Danke an alle, unten aufgelisteten, Spender! Dank euch gibt es dieses Projekt noch! <3')
    .setDescription(tableload.donators.join(' , '));
    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: []
};
exports.help = {
	name: 'donators',
	description: 'Gives you a list with all donators who are supporting the project!',
	usage: 'donators',
	example: 'donators',
	category: 'utility'
};

