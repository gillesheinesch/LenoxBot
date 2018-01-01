const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
    const tableload = client.botconfs.get('donators');

    if (tableload.donators.length < 1) return msg.reply(lang.donators_nodonators);

    const embed = new Discord.RichEmbed()
    .setColor('#77f442')
    .setAuthor(lang.donators_thankyou)
    .setDescription(tableload.donators.join(' , '));
    msg.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'donators',
	description: 'Gives you a list with all donators who are supporting the project!',
	usage: 'donators',
	example: ['donators'],
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};

