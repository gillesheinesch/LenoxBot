const sql = require('sqlite');
const settings = require('../../settings.json');
sql.open(`../${settings.sqlitefilename}.sqlite`);
const math = require('math-expression-evaluator');
const Discord = require('discord.js');
exports.run = async (client, msg, args, lang) => {
	const userdb = client.userdb.get(msg.author.id);
	const randomForNumbers = Math.random();
	let firstNumber;
	let secondNumber;

	if (randomForNumbers <= 0.33) {
		firstNumber = Math.floor(Math.random() * 10) + Math.floor(userdb.mathematics.level / 5);
		secondNumber = Math.floor(Math.random() * 15) + Math.floor(userdb.mathematics.level / 5);
	} else if (randomForNumbers <= 0.66) {
		firstNumber = Math.floor(Math.random() * 10) - Math.floor(userdb.mathematics.level / 5);
		secondNumber = Math.floor(Math.random() * 15) + Math.floor(userdb.mathematics.level / 5);
	} else if (randomForNumbers <= 1) {
		firstNumber = Math.floor(Math.random() * 10) - Math.floor(userdb.mathematics.level / 5);
		secondNumber = Math.floor(Math.random() * 15) - Math.floor(userdb.mathematics.level / 5);
	}

	const signs = ['+', '-', '*'];
	const sign = Math.floor(Math.random() * signs.length);

	const embed = new Discord.RichEmbed()
		.setFooter(msg.author.tag)
		.setTitle(lang.math_embedauthor)
		.setColor('#3399ff')
		.setDescription(`**${Number(firstNumber) < 0 ? `(${firstNumber})` : firstNumber} ${signs[sign]} ${Number(secondNumber) < 0 ? `(${secondNumber})` : secondNumber}**`);

	await msg.channel.send({
		embed: embed
	});

	let response;
	try {
		response = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id, {
			maxMatches: 1,
			time: 7000,
			errors: ['time']
		});
	} catch (error) {
		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals - 10} WHERE userId = ${msg.author.id}`);
		});

		return msg.reply(lang.math_timepassed);
	}

	const mathCalculation = await math.eval(`${firstNumber} ${signs[sign]} ${secondNumber}`);

	if (mathCalculation === Number(response.first().content)) {
		userdb.mathematics.points += 2;

		const mathLevel = Math.floor(1.5 * Math.sqrt(userdb.mathematics.points + 1));
		if (mathLevel > userdb.mathematics.level) {
			userdb.mathematics.level = mathLevel;
		}
		client.userdb.set(msg.author.id, userdb);

		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 15 + Math.floor(userdb.mathematics.level / 5)]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals + (15 + Math.floor(userdb.mathematics.level / 5))} WHERE userId = ${msg.author.id}`);
		});

		const winauthor = lang.math_winauthor.replace('%amount', 15 + Math.floor(userdb.mathematics.level / 5));
		const embeddescription = lang.math_embeddescription.replace('%points', userdb.mathematics.points).replace('%level', userdb.mathematics.level);
		const winnerEmbed = new Discord.RichEmbed()
			.setColor('#00ff00')
			.setFooter(msg.author.tag)
			.setTitle(winauthor)
			.setDescription(embeddescription);

		msg.channel.send({
			embed: winnerEmbed
		});
	} else {
		sql.get(`SELECT * FROM medals WHERE userId ="${msg.author.id}"`).then(row => {
			if (!row) {
				sql.run('INSERT INTO medals (userId, medals) VALUES (?, ?)', [msg.author.id, 0]);
			}
			sql.run(`UPDATE medals SET medals = ${row.medals - 10} WHERE userId = ${msg.author.id}`);
		});

		const embeddescription = lang.math_embeddescription.replace('%points', userdb.mathematics.points).replace('%level', userdb.mathematics.level);
		const loseauthor = lang.math_loseauthor.replace('%correct', mathCalculation);
		const loserEmbed = new Discord.RichEmbed()
			.setColor('#ff0000')
			.setFooter(msg.author.tag)
			.setTitle(loseauthor)
			.setDescription(embeddescription);

		msg.channel.send({
			embed: loserEmbed
		});
	}
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
	name: 'math',
	description: `Solve mathematical calculations to get credits`,
	usage: 'math',
	example: ['math'],
	category: 'currency',
	botpermissions: ['SEND_MESSAGES']
};
