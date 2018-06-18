const got = require('got');
const API_KEY = 'dc6zaTOxFJmzC';
const Discord = require('discord.js');

exports.run = async(client, msg, args, lang) => {
    if (args.length < 1) {
        return msg.channel.send(lang.gif_noinput).then(m => m.delete(10000));
    }

    const res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${encodeURIComponent(args.join(' '))}`, {
        json: true
    });

    if (!res || !res.body || !res.body.data) {
        return msg.channel.send(lang.gif_error).then(m => m.delete(10000));
    }

    const embed = new Discord.RichEmbed()
        .setImage(`${res.body.data.image_url}`)
        .setAuthor(`${msg.author.tag}`, msg.author.displayAvatarURL)
        .setColor('#0066CC');
    msg.channel.send({
        embed
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
<<<<<<< HEAD
    userpermissions: []
=======
    userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
    name: 'gif',
    description: 'Searches for a gif',
    usage: 'gif {query}',
    example: ['gif Discord', 'gif Fortnite'],
    category: 'searches',
    botpermissions: ['SEND_MESSAGES']
};
