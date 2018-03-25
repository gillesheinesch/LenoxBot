const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
const moment = require('moment');
require('moment-duration-format');
exports.run = async (client, msg, args, lang) => {
	const ms = require('ms');
	const tableload = client.guildconfs.get(msg.guild.id);
	const userdb = client.userdb.get(msg.author.id);
	const Discord = require('discord.js');

	if (!tableload.jobstatus) {
		userdb.jobstatus = false;
		await client.userdb.set(msg.author.id, userdb);
	}

	if (userdb.jobstatus === true) {
		const timestamps = client.cooldowns.get('job');
		timestamps.delete(msg.author.id);
		return msg.reply(lang.job_error);
	}

	const jobslist = [['farmer', 120, Math.floor(Math.random() * 200) + 100, 'tractor'], ['technician', 90, Math.floor(Math.random() * 150) + 75, 'hammer'], ['trainer', 90, Math.floor(Math.random() * 150) + 75, 'football'], ['applespicker', 5, Math.floor(Math.random() * 10) + 3, undefined], ['professor', 60, Math.floor(Math.random() * 50) + 25, 'book'], ['baker', 30, Math.floor(Math.random() * 25) + 15, undefined], ['taxidriver', 240, Math.floor(Math.random() * 400) + 200, 'car'], ['paramedic', 180, Math.floor(Math.random() * 300) + 150, 'syringe'], ['police', 180, Math.floor(Math.random() * 300) + 150, 'gun'], ['chef', 120, Math.floor(Math.random() * 200) + 60, 'knife']];

	var index = 0;

	const embed = new Discord.RichEmbed()
	.setColor('#66ff66')
	.setFooter(lang.job_embed)
	.setAuthor(lang.job_available);

	for (var i = 0; i < jobslist.length; i++) {
		embed.addField(`${++index}. ${lang[`job_${jobslist[i][0]}title`]} (${moment.duration(jobslist[i][1], "minutes").format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`)})`, `${lang[`job_${jobslist[i][0]}description`]}`);
	}

	msg.channel.send({ embed });

	try {
		var response = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < jobslist.length + 1, {
			maxMatches: 1,
			time: 60000,
			errors: ['time']
		});
	} catch (error) {
		return msg.reply(lang.job_timeerror);
	}

	if (jobslist[response.first().content - 1][3] !== undefined) {
		const notenough = lang.job_notenough.replace('%item', `\`${jobslist[response.first().content - 1][3]}\``);
		if (!userdb.inventory[jobslist[response.first().content - 1][3]] >= 1) {
			const timestamps = client.cooldowns.get('job');
			timestamps.delete(msg.author.id);
			return msg.reply(notenough);
		}
	}

	const job = lang[`job_${jobslist[response.first().content - 1][0]}title`];
	const jobtime = jobslist[response.first().content - 1][1];
	const amount = jobslist[response.first().content - 1][2];

	userdb.jobstatus = true;
	await client.userdb.set(msg.author.id, userdb);

	const sentmessage = lang.job_sentmessage.replace('%jobtitle', `\`${job}\``).replace('%jobtime', jobtime);
	await msg.reply(sentmessage);

	setTimeout(function () {
		userdb.jobstatus = false;
		client.userdb.set(msg.author.id, userdb);
		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + amount} WHERE userId = ${msg.author.id}`);
		});

		const jobfinish = lang.job_jobfinish.replace('%amount', amount);
		msg.member.send(jobfinish);
	}, ms(`${jobtime}m`));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	userpermissions: [],
	cooldown: 60500
};
exports.help = {
	name: 'job',
	description: `A full list of available jobs you can accept to earn credits`,
	usage: 'job',
	example: ['job'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
