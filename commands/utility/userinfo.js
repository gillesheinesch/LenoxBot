const Discord = require('discord.js');
const moment = require('moment');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
require('moment-duration-format');
exports.run = async(client, msg, args, lang) => {
	var user = msg.mentions.users.first();

	if (!user && args.slice().length === 0) {
		user = msg.author;
	} else if (user) {
		user = msg.mentions.users.first();
		if (user.bot) return msg.reply(lang.userinfo_botinfo);
	} else {
		try {
			if (!msg.guild.members.get(args.slice().join(" "))) throw 'Usernotfound';
			
			user = await msg.guild.members.get(args.slice().join(" "));
			user = user.user;

			if (user.bot) return msg.reply(lang.userinfo_botinfo);
		} catch (error) {
			return msg.reply(lang.userinfo_usernotfound);
		}
	}

	const member = msg.guild.member(user) || await msg.guild.fetchMember(user);
	const userondiscord = moment(user.createdTimestamp).format('MMMM Do YYYY, h:mm:ss a');
	const useronserver = moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a');
	const userdb = client.userdb.get(user.id);

	const credits = await sql.get(`SELECT * FROM medals WHERE userId = "${user.id}"`);
	const lenoxbotcoin = client.emojis.get('412952854354067456');

	var description = '';

	try {
		description = userdb.description.length === 0 ? lang.userinfo_descriptioninfo : userdb.description;
	} catch (error) {
		description = lang.userinfo_descriptioninfo;
	}

	const embed = new Discord.RichEmbed()
		.setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL)
		.setColor('#0066CC')
		.setThumbnail(user.displayAvatarURL)
		.setDescription(description)
		.addField(`${lenoxbotcoin} ${lang.credits_credits}`, `$${credits.medals}`)
		.addField(`📥 ${lang.userinfo_created}`, userondiscord)
		.addField(`📌 ${lang.userinfo_joined}`, useronserver)
		.addField(`🏷 ${lang.userinfo_roles}`, member.roles.filter(r => r.name !== '@everyone').map(role => role.name).join(', ') || lang.userinfo_noroles)
		.addField(`⌚ ${lang.userinfo_status}`, user.presence.status)
		.addField(`🎮 ${lang.userinfo_playing}`, user.presence.game ? user.presence.game.name : lang.userinfo_nothing);

	msg.channel.send({ embed: embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['uinfo', 'ui'],
<<<<<<< HEAD
	userpermissions: []
=======
	userpermissions: [], dashboardsettings: true
>>>>>>> 0557862ab221a2e5a3717e2c754abc37a5c72aaa
};
exports.help = {
	name: 'userinfo',
	description: 'Gives you information about you or another user',
	usage: 'userinfo [@User/UserID]',
	example: ['userinfo @Tester#0001', 'userinfo 327533963923161090'],
	category: 'utility',
	botpermissions: ['SEND_MESSAGES']
};
