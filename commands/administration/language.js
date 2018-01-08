const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
    const tableload = client.guildconfs.get(msg.guild.id);
    const margs = msg.content.split(" ");
    const input = args.slice();

    const validation = ['en', 'de'];

    const already = lang.language_already.replace('%language', input[0]);
    const changed = lang.language_changed.replace('%input', input[0]);

    if (input.length === 0) {
        const embed = new Discord.RichEmbed()
        .setDescription('en = English \nde = German')
        .setColor('0066CC')
        .setAuthor(lang.language_languages);
        return msg.channel.send({ embed });
    }

    for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() === 'en') {
                if (tableload.language === 'en') return msg.channel.send(already);

                tableload.language = 'en';
                await client.guildconfs.set(msg.guild.id, tableload);
            
                return msg.channel.send(changed);
            } else if (margs[1].toLowerCase() === 'de') {
                if (tableload.language === 'de') return msg.channel.send(already);

                tableload.language = 'de';
                await client.guildconfs.set(msg.guild.id, tableload);

                return msg.channel.send(changed);
            }
        }
    }
    msg.channel.send(lang.language_error);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
    aliases: [],
    userpermissions: ['ADMINISTRATOR']
};
exports.help = {
	name: 'language',
	description: 'Changes the language of the bot for this server',
	usage: 'language',
    example: ['language', 'language de'],
    category: 'administration',
    botpermissions: ['SEND_MESSAGES']
};
