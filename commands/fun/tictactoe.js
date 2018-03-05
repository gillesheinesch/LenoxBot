const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	var mention = msg.mentions.members.first();
	var validation = [0, 0, 0, 0, 0, 0, 0, 0, 0];

	if (!mention) return msg.channel.send(lang.tictactoe_nomention);
	if (mention.presence.status === 'offline') return msg.reply(lang.tictactoe_notoline);
	if (mention.user.bot) return msg.channel.send(lang.tictactoe_botmention);
	if (msg.author.id === mention.id) return msg.channel.send(lang.tictactoe_error);

	await msg.channel.send(`${lang.tictactoe_gamecreated} 😼`);
	var game = await msg.channel.send('``` 1 | 2 | 3 \n---|---|--- \n 4 | 5 | 6 \n---|---|--- \n 7 | 8 | 9 ```');

	try {
		await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 1;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', mention);
		return msg.channel.send(`${msg.author} ${noanswer}`);
	}

	try {
		await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 2;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author);
		return msg.channel.send(`${mention} ${noanswer}`);
	}

	try {
		await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 1;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', mention);
		return msg.channel.send(`${msg.author} ${noanswer}`);
	}

	try {
		await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 2;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author);
		return msg.channel.send(`${mention}} ${noanswer}`);
	}

	try {
		await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 1;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', mention);
		return msg.channel.send(`${msg.author} ${noanswer}`);
	}

	try {
		await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 2;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author);
		return msg.channel.send(`${mention}} ${noanswer}`);
	}

	if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	}

	try {
		await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 1;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', mention);
		return msg.channel.send(`${msg.author} ${noanswer}`);
	}

	if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	}

	try {
		await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 2;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author);
		return msg.channel.send(`${mention}} ${noanswer}`);
	}

	if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	}

	try {
		await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
		var response1 = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
			maxMatches: 1,
			time: 15000,
			errors: ['time']
		});
		const edit = game.content.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
		await game.delete();
		game = await msg.channel.send(edit);
		validation[response1.first().content - 1] = 1;
	} catch (error) {
		const noanswer = lang.tictactoe_noanswer.replace('%user', mention);
		return msg.channel.send(`${msg.author} ${noanswer}`);
	}

	if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
		const win = lang.tictactoe_win.replace('%user', msg.author);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
		const win = lang.tictactoe_win.replace('%user', mention);
		return msg.channel.send(win);
	} else {
		return msg.channel.send(lang.tictactoe_draw);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ['ttt'],
    userpermissions: []
};
exports.help = {
	name: 'tictactoe',
	description: 'Play a round of TicTacToe against another Discord user',
	usage: 'tictactoe {@User}',
	example: ['tictactoe @Tester#7584'],
	category: 'fun',
    botpermissions: ['SEND_MESSAGES']
};
