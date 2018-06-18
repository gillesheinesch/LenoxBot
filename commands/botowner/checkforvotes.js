const Discord = require('discord.js');
const sql = require('sqlite');
sql.open("../lenoxbotscore.sqlite");
exports.run = async (client, msg, args, lang) => {
	if (msg.author.id !== '238590234135101440') return msg.channel.send(lang.botownercommands_error);

	var array = [];
	const list = await client.dbl.getVotes(true);

	for (var i = 0; i < list.length; i++) {
		array.push(list[i]);
	}

	const upvoteconfs = { allusers: array };

	await client.botconfs.set('upvote', upvoteconfs);

	const botconfs = client.botconfs.get('upvote');

	var test = setInterval(async function () {
		if (botconfs.allusers.length === 0) return clearInterval(test);
			const embed = new Discord.RichEmbed()
			.setDescription('This user got 500 credits by upvoting the bot on discordbots.org (https://discordbots.org/bot/354712333853130752/vote) \n\nTo check if the user got his credits, he can use ?credits')
			.setColor('#99ff66')
			.setTitle('Upvote reward')
			.setAuthor(`${client.users.get(botconfs.allusers[0]) ? client.users.get(botconfs.allusers[0]).tag : botconfs.allusers[0]}`);

			await client.channels.get('419921172982005760').send({ embed });

			await sql.get(`SELECT * FROM medals WHERE userId ="${botconfs.allusers[0]}"`).then(row => {
				if (!row) {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [botconfs.allusers[0], 500]);
				} else {
				sql.run(`UPDATE medals SET medals = ${row.medals + 500} WHERE userId = ${botconfs.allusers[0]}`);
				}
			}).catch((error) => {
				console.error(error);
				sql.run("CREATE TABLE IF NOT EXISTS medals (userId TEXT, medals INTEGER)").then(() => {
					sql.run("INSERT INTO medals (userId, medals) VALUES (?, ?)", [botconfs.allusers[0], 500]);
				});
			});
			botconfs.allusers.splice(0, 1);
			await client.botconfs.set('upvote', botconfs);
	}, 3000);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],

	,

	userpermissions: [], dashboardsettings: true,

	cooldown: 86400000
};
exports.help = {
	name: 'checkforvotes',
	description: 'translator',
	usage: 'donatoradd',
	example: ['donatoradd'],
	category: 'botowner',
	botpermissions: ['SEND_MESSAGES']
};