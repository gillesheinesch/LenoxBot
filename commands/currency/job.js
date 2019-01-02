const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
const moment = require('moment');
require('moment-duration-format');
const Discord = require('discord.js');
const ms = require('ms');
exports.run = async (client, msg, args, lang) => {
	const userdb = client.userdb.get(msg.author.id);
	const botconfs = client.botconfs.get('botconfs');

	if (userdb.jobstatus === true) {
		const timestamps = client.cooldowns.get('job');
		delete timestamps[msg.author.id];
		client.cooldowns.set('job', timestamps);
		return msg.reply(lang.job_error);
	}

	const jobslist = [
		['farmer', 240, Math.floor(Math.random() * 400) + 100, 'tractor', 'https://imgur.com/1PVI8hM.png'],
		['technician', 90, Math.floor(Math.random() * 150) + 75, 'hammer', 'https://imgur.com/yQmaFIe.png'],
		['trainer', 90, Math.floor(Math.random() * 150) + 75, 'football', 'https://imgur.com/bRqzmKw.png'],
		['applespicker', 1, Math.floor(Math.random() * 10) + 3, 'undefined', 'https://imgur.com/qv4iev8.png'],
		['professor', 60, Math.floor(Math.random() * 50) + 25, 'book', 'https://imgur.com/YUc7Ppb.png'],
		['baker', 30, Math.floor(Math.random() * 25) + 15, 'undefined', 'https://imgur.com/HRdvO6r.png'],
		['taxidriver', 240, Math.floor(Math.random() * 400) + 200, 'car', 'https://imgur.com/uOMpS17.png'],
		['paramedic', 180, Math.floor(Math.random() * 300) + 150, 'syringe', 'https://imgur.com/Z97fWoc.png'],
		['police', 180, Math.floor(Math.random() * 300) + 150, 'gun', 'https://imgur.com/HQXp8R8.png'],
		['chef', 120, Math.floor(Math.random() * 200) + 60, 'knife', 'https://imgur.com/F940PkL.png']
	];

	let index = 0;

	const embed = new Discord.RichEmbed()
		.setColor('#66ff66')
		.setFooter(lang.job_embed)
		.setAuthor(lang.job_available);

	for (let i = 0; i < jobslist.length; i++) {
		embed.addField(`${++index}. ${lang[`job_${jobslist[i][0]}title`]} (${moment.duration(jobslist[i][1], 'minutes').format(`d[ ${lang.messageevent_days}], h[ ${lang.messageevent_hours}], m[ ${lang.messageevent_minutes}] s[ ${lang.messageevent_seconds}]`)})`, `${lang[`job_${jobslist[i][0]}description`]}`);
	}

	msg.channel.send({
		embed
	});

	let response;
	try {
		response = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id, {
			maxMatches: 1,
			time: 60000,
			errors: ['time']
		});
	} catch (error) {
		return msg.reply(lang.job_timeerror);
	}

	if (isNaN(response.first().content)) return msg.reply(lang.job_nonumberror);
	if (response.first().content >= (jobslist.length + 1)) return msg.reply(lang.job_wrongnumber);
	if (response.first().content <= 0) return msg.reply(lang.job_wrongnumber);

	if (jobslist[response.first().content - 1][3] !== 'undefined') {
		const notenough = lang.job_notenough.replace('%item', `\`${jobslist[response.first().content - 1][3]}\``);
		if (!userdb.inventory[jobslist[response.first().content - 1][3]] >= 1) {
			const timestamps = client.cooldowns.get('job');
			delete timestamps[msg.author.id];
			client.cooldowns.set('job', timestamps);
			return msg.reply(notenough);
		}
	}

	const job = lang[`job_${jobslist[response.first().content - 1][0]}title`];
	const jobtime = jobslist[response.first().content - 1][1];
	const amount = jobslist[response.first().content - 1][2];
	const jobpicture = jobslist[response.first().content - 1][4];

	userdb.jobstatus = true;

	const duration = lang.job_duration.replace('%duration', jobtime);

	const embed2 = new Discord.RichEmbed()
		.setColor('#66ff33')
		.setTitle(job)
		.setDescription(`${lang.job_sentmessage} \n\n${duration}`)
		.setThumbnail(jobpicture);
	await msg.channel.send({
		embed: embed2
	});

	botconfs.jobreminder[msg.author.id] = {
		userID: msg.author.id,
		remind: Date.now() + ms(`${jobtime}m`),
		amount: amount,
		job: job,
		jobtime: jobtime,
		discordServerID: msg.guild.id,
		channelID: msg.channel.id
	};

	const activityEmbed = new Discord.RichEmbed()
		.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
		.setDescription(`**Job:** ${job} \n**Duration:** ${jobtime} minutes \n**Amount:** ${amount} credits`)
		.addField('Guild', `${msg.guild.name} (${msg.guild.id})`)
		.addField('Channel', `${msg.channel.name} (${msg.channel.id})`)
		.setColor('AQUA')
		.setFooter('JOB STARTED')
		.setTimestamp();
	if (botconfs.activity === true) {
		const messagechannel = client.channels.get(botconfs.activitychannel);
		messagechannel.send({
			embed: activityEmbed
		});
	}

	client.botconfs.set('botconfs', botconfs);
	client.userdb.set(msg.author.id, userdb);

	setTimeout(() => {
		userdb.jobstatus = false;

		delete botconfs.jobreminder[msg.author.id];

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + amount} WHERE userId = ${msg.author.id}`);
		});

		const jobfinish = `Congratulations! You have successfully completed your job. You earned a total of ${amount} credits`;
		msg.member.send(jobfinish);

		const activityEmbed2 = new Discord.RichEmbed()
			.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL)
			.setDescription(`**Job:** ${job} \n**Duration:** ${jobtime} minutes \n**Amount:** ${amount} credits`)
			.addField('Guild', `${msg.guild.name} (${msg.guild.id})`)
			.addField('Channel', `${msg.channel.name} (${msg.channel.id})`)
			.setColor('AQUA')
			.setFooter('JOB FINISHED')
			.setTimestamp();
		if (botconfs.activity === true) {
			const messagechannel = client.channels.get(botconfs.activitychannel);
			messagechannel.send({
				embed: activityEmbed2
			});
		}

		client.userdb.set(msg.author.id, userdb);
		client.botconfs.set('botconfs', botconfs);
	}, ms(`${jobtime}m`));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'job',
	description: `A full list of available jobs you can accept to earn credits`,
	usage: 'job',
	example: ['job'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
