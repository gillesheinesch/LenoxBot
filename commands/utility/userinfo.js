const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
exports.run = async(client, msg, args) => {
    const user = msg.mentions.users.first() || msg.author;
    const member = msg.guild.member(user) || await msg.guild.fetchMember(user);
    const userondiscord = moment(user.createdTimestamp).format('MMMM Do YYYY, h:mm:ss a');
    const useronserver = moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a');
	const embed = new Discord.RichEmbed()
        .setAuthor(user.tag, user.displayAvatarURL)
        .setColor('#0066CC')
        .setTimestamp()
        .setThumbnail(user.displayAvatarURL)
        .setFooter('LenoxBot userinfo')
        .addField(`👤 User`, `${user.tag} (${user.id})`)
        .addField(`📥 Discord-Account created`, userondiscord)
        .addField(`📌 Joined this Discord Server`, useronserver)
        .addField(`🏷 roles`, member.roles.map(role => role.name).join(', ') || 'The user has no roles on this Discord server')
        .addField('⌚ status', user.presence.status)
        .addField('🎮 is playing', user.presence.game ? user.presence.game.name : 'nothing');

	msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: ['uinfo'],
    userpermissions: []
};
exports.help = {
	name: 'userinfo',
	description: 'Gives you information about you or another user',
    usage: 'userinfo [@User]',
    example: 'userinfo @Monkeyyy11#7584',
	category: 'utility',
    botpermissions: ['SEND_MESSAGES']
};
