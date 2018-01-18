const Discord = require('discord.js');
exports.run = (client, msg, args, lang) => {
    if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);
    const validation = ['lenoxbot', 'teamemil'];
    const margs = msg.content.split(" ");

    for (i = 0; i < margs.length; i++) {
		if (validation.indexOf(margs[i].toLowerCase()) >= 0) {
			if (margs[1].toLowerCase() == "lenoxbot") {
                const embed = new Discord.RichEmbed()
                .setDescription(`LenoxBot, not a Discord Bot but the Discord Bot. \n\nWe offer you a whole range of features! Administration, Moderation, Fun, Utility, Music, NSFW, Searches Commands and a whole application system for your guild server. **You can change all settings and customize the bot to your liking** \n\nHere you can find more information about LenoxBot: https://lenoxbot.com \n\nYou can join our Discord Server via this link: https://discord.gg/5mpwCr8`)
                .setColor('#ff5050')
                .setAuthor('LenoxBot', client.user.displayAvatarURL);

                return msg.channel.send({ embed });
            }
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    userpermissions: []
  };

  exports.help = {
    name: 'partner',
    description: 'Partner embeds',
    usage: 'partner {guildname}',
    example: ['partner lenoxbot'],
	category: 'botowner',
    botpermissions: ['SEND_MESSAGES']
  };

