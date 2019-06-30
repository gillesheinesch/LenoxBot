const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: language => language.get('COMMAND_TICTACTOE_DESCRIPTION'),
			extendedHelp: language => language.get('COMMAND_TICTACTOE_EXTENDEDHELP'),
			usage: '<GuildMember:member>',
			aliases: ['ttt'],
			requiredPermissions: ['SEND_MESSAGES']
		});
	}

	async run(message, [member]) {
		console.log(member);
		const validation = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		if (!member) return messsage.channel.sendLocale('COMMAND_TICTACTOE_NOMENTION');
		if (member.user.bot) return message.channel.sendLocale('COMMAND_TICTACTOE_BOTMENTION');
		if (member.presence.status === 'offline') return message.reply(message.language.get('COMMAND_TICTACTOE_NOTONLINE'));
		if (message.author.id === member.id) return message.channel.sendLocale('COMMAND_TICTACTOE_ERROR');

		let wantToPlayMessage;
		let wantToPlay;
		try {
			const wannaplay = message.language.get('COMMAND_TICTACTOE_WANNAPLAY', member, message.author);
			wantToPlayMessage = await message.channel.send(wannaplay);
			wantToPlay = await message.channel.awaitMessages(msg2 => msg2.author.id === member.id, {
				max: 1,
				time: 60000,
				errors: ['time']
			});
		} catch (error) {
			return wantToPlayMessage.delete();
		}

		if (wantToPlay.first().content.toLowerCase() !== 'yes') {
			const gamecanceled = message.language.get('COMMAND_TICTACTOE_GAMECANCELED', member.user.tag);
			return message.reply(gamecanceled);
		}

		await wantToPlayMessage.delete();
		await wantToPlay.first().delete();

		await message.channel.send(`${message.language.get('COMMAND_TICTACTOE_GAMECREATED')} 😼`);
		let gameEmbed = new MessageEmbed()
			.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
			.setDescription('``` 1 | 2 | 3 \n---|---|--  \n 4 | 5 | 6 \n---|---|--  \n 7 | 8 | 9```')
			.setFooter(`${message.author.tag} vs ${member.user.tag}`)
			.setColor('BLUE');
		const game = await message.channel.send({
			embed: gameEmbed
		});

		try {
			const yourTurnMessage = await message.channel.send(`${message.author}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => message.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 1;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${member}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => msg2.author.id === member.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 2;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${message.author}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => message.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 1;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${member}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => msg2.author.id === member.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 2;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${message.author}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => message.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 1;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${member}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => msg2.author.id === member.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 2;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		const winnerEmbed = new MessageEmbed()
			.setTitle(message.language.get('COMMAND_TICTACTOE_GAMEEND'))
			.setFooter(`${message.author.tag} vs ${member.user.tag}`)
			.setColor('GREEN');

		if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${message.author}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => message.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 1;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${member}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => msg2.author.id === member.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 2;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		}

		try {
			const yourTurnMessage = await message.channel.send(`${message.author}, ${message.language.get('COMMAND_TICTACTOE_TURN')} ‼`);
			const response1 = await message.channel.awaitMessages(msg2 => message.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
				max: 1,
				time: 15000,
				errors: ['time']
			});

			await yourTurnMessage.delete();
			await response1.first().delete();

			const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === message.author.id ? 'X' : 'O');
			gameEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_TITLE'))
				.setDescription(editedDescription)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('BLUE');

			await game.edit({
				embed: gameEmbed
			});
			validation[response1.first().content - 1] = 1;
		} catch (error) {
			const noanswer = message.language.get('COMMAND_TICTACTOE_NOANSWER', message.author, member);
			const noAnswerEmbed = new MessageEmbed()
				.setTitle(message.language.get('COMMAND_TICTACTOE_NOANSWERTITLE'))
				.setDescription(noanswer)
				.setFooter(`${message.author.tag} vs ${member.user.tag}`)
				.setColor('RED');
			return message.channel.send({
				embed: noAnswerEmbed
			});
		}

		if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', message.author);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		} else if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
			const win = message.language.get('COMMAND_TICTACTOE_WIN', member);
			winnerEmbed.setDescription(win);
			return message.channel.send({
				embed: winnerEmbed
			});
		}
		const drawEmbed = new MessageEmbed()
			.setTitle(message.language.get('COMMAND_TICTACTOE_GAMEEND'))
			.setDescription(message.language.get('COMMAND_TICTACTOE_DRAW'))
			.setFooter(`${message.author.tag} vs ${member.user.tag}`)
			.setColor('ORANGE');

		return message.channel.send({
			embed: drawEmbed
		});
	}
};
