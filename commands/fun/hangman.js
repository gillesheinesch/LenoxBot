const Discord = require(`discord.js`);
exports.run = async (client, msg, args, lang) => {
	let chances = 15;
	const triedLetters = [];
	const hangmanPictures = [
		'https://imgur.com/Ad5vgPD.png',
		'https://imgur.com/jxPXvDP.png',
		'https://imgur.com/M6rbN9m.png',
		'https://imgur.com/KFEHYJG.png',
		'https://imgur.com/fcEsw9A.png',
		'https://imgur.com/S3bBIhl.png',
		'https://imgur.com/gwS4ohM.png',
		'https://imgur.com/RZQCq21.png',
		'https://imgur.com/Py8zHOx.png',
		'https://imgur.com/ikOBjSm.png',
		'https://imgur.com/jSlG4cf.png',
		'https://imgur.com/wsxb7Uq.png',
		'https://imgur.com/bVsUfP3.png',
		'https://imgur.com/Mwzwp6i.png',
		'https://imgur.com/qltUWtL.png',
		'https://imgur.com/vWoekpB.png'
	];

	const hangmanWords = [];
	for (const x in lang) {
		if (x.includes('hangman_wordtoguess')) {
			hangmanWords.push(lang[x]);
		}
	}
	const hangmanIndex = Math.floor(Math.random() * hangmanWords.length);
	const wordToGuess = hangmanWords[hangmanIndex].toLowerCase();
	const wordToGuessInArray = wordToGuess.split('');

	const newWordString = [];
	for (let i = 0; i < wordToGuess.length; i++) {
		newWordString.push('_');
	}

	const mention = msg.mentions.members.first();
	if (mention) {
		const questionMessage = await msg.channel.send(`${mention}, do you want to play hangman against ${msg.author}?`);

		await questionMessage.react('👍');
		await questionMessage.react('👎');

		const collector = questionMessage.createReactionCollector((reaction, user) => user.id === mention.id, {
			time: 120000
		});
		collector.on('collect', async r => {
			if (r.emoji.name === '👍') {
				await questionMessage.delete();

				const firstEmbed = new Discord.RichEmbed()
					.setColor('BLUE')
					.setTitle('Hangman game has been started!')
					.setFooter('15/15 Chances left')
					.setImage(hangmanPictures[15 - chances])
					.setDescription(`**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);

				const hangmanEmbed = await msg.channel.send({
					embed: firstEmbed
				});

				let message;
				let response;

				let turn = 1;

				for (let i = 0; i < 1000; i++) {
					try {
						if (message) {
							await message.delete();
							await response.first().delete();
						}

						if (turn === 1) {
							message = await msg.reply(`Please send a letter or guess the word`);
							response = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id, {
								maxMatches: 1,
								time: 180000,
								errors: ['time']
							});
						} else {
							message = await msg.channel.send(`${mention}, Please send a letter or guess the word`);
							response = await msg.channel.awaitMessages(msg2 => mention.id === msg2.author.id, {
								maxMatches: 1,
								time: 180000,
								errors: ['time']
							});
						}

						if (response.first().content.toLowerCase().match(/[a-z]/i)) {
							if (response.first().content.length === 1) {
								if (wordToGuessInArray.includes(response.first().content.toLowerCase())) {
									firstEmbed.setTitle(`You're right! 😄`);

									for (let index2 = 0; index2 < wordToGuess.length; index2++) {
										if (wordToGuess[index2] === response.first().content.toLowerCase()) {
											newWordString[index2] = response.first().content.toLowerCase();
										}
									}
									firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);

									hangmanEmbed.edit({
										embed: firstEmbed
									});

									if (turn === 1) {
										turn = 2;
									} else {
										turn = 1;
									}

									if (!newWordString.includes('_')) return msg.reply('Game ended! You won!');
								} else {
									if (!triedLetters.includes(response.first().content.toLowerCase())) {
										chances -= 1;
										triedLetters.push(response.first().content.toLowerCase());
									}

									if (chances > 0) {
										firstEmbed.setTitle(`You're not right! 😢`);
										firstEmbed.setFooter(`${chances}/15 Chances left`);
										firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);
										firstEmbed.setImage(hangmanPictures[15 - chances]);

										if (turn === 1) {
											turn = 2;
										} else {
											turn = 1;
										}

										hangmanEmbed.edit({
											embed: firstEmbed
										});
									} else {
										firstEmbed.setTitle(`You're not right! 😢`);
										firstEmbed.setFooter(`${chances}/15 Chances left`);
										firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${wordToGuess}\`\`\``);
										firstEmbed.setImage(hangmanPictures[15 - chances]);

										if (turn === 1) {
											turn = 2;
										} else {
											turn = 1;
										}

										hangmanEmbed.edit({
											embed: firstEmbed
										});
										return msg.reply('You lost!');
									}
								}
							} else {
								/* eslint no-lonely-if: 0 */
								if (wordToGuess.length === response.first().content.length) {
									if (wordToGuess === response.first().content.toLowerCase()) {
										firstEmbed.setTitle(`You're right! 😄`);
										firstEmbed.setFooter(`${chances}/15 Chances left`);
										firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${wordToGuess}\`\`\``);

										if (turn === 1) {
											turn = 2;
										} else {
											turn = 1;
										}

										hangmanEmbed.edit({
											embed: firstEmbed
										});
										return msg.reply('You won!');
									}

									chances -= 1;
									firstEmbed.setTitle(`You're not right! 😢`);
									firstEmbed.setFooter(`${chances}/15 Chances left`);
									firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);
									firstEmbed.setImage(hangmanPictures[15 - chances]);

									if (turn === 1) {
										turn = 2;
									} else {
										turn = 1;
									}

									hangmanEmbed.edit({
										embed: firstEmbed
									});
								} else {
									msg.reply(`The word must have ${wordToGuess.length} characters!`);
								}
							}
						} else {
							msg.reply('not a letter!');
						}
					} catch (error) {
						return msg.channel.send(`You didn't give an answer`);
					}
				}
			} else if (r.emoji.name === '👎') {
				await questionMessage.delete();
				return msg.reply(`We're sorry but your mentioned user doesn't want to play against you!`);
			}
		});
	} else {
		const firstEmbed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setTitle('Hangman game has been started!')
			.setFooter('15/15 Chances left')
			.setImage(hangmanPictures[15 - chances])
			.setDescription(`**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);

		const hangmanEmbed = await msg.channel.send({
			embed: firstEmbed
		});

		let message;
		let response;

		for (let i = 0; i < 1000; i++) {
			try {
				if (message) {
					await message.delete();
					await response.first().delete();
				}
				message = await msg.reply(`Please send a letter or guess the word`);
				response = await msg.channel.awaitMessages(msg2 => msg.author.id === msg2.author.id, {
					maxMatches: 1,
					time: 180000,
					errors: ['time']
				});

				if (response.first().content.toLowerCase().match(/[a-z]/i)) {
					if (response.first().content.length === 1) {
						if (wordToGuessInArray.includes(response.first().content.toLowerCase())) {
							firstEmbed.setTitle(`You're right! 😄`);

							for (let index2 = 0; index2 < wordToGuess.length; index2++) {
								if (wordToGuess[index2] === response.first().content.toLowerCase()) {
									newWordString[index2] = response.first().content.toLowerCase();
								}
							}
							firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);

							hangmanEmbed.edit({
								embed: firstEmbed
							});

							if (!newWordString.includes('_')) return msg.reply('Game ended! You won!');
						} else {
							if (!triedLetters.includes(response.first().content.toLowerCase())) {
								chances -= 1;
								triedLetters.push(response.first().content.toLowerCase());
							}

							if (chances > 0) {
								firstEmbed.setTitle(`You're not right! 😢`);
								firstEmbed.setFooter(`${chances}/15 Chances left`);
								firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);
								firstEmbed.setImage(hangmanPictures[15 - chances]);

								hangmanEmbed.edit({
									embed: firstEmbed
								});
							} else {
								firstEmbed.setTitle(`You're not right! 😢`);
								firstEmbed.setFooter(`${chances}/15 Chances left`);
								firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${wordToGuess}\`\`\``);
								firstEmbed.setImage(hangmanPictures[15 - chances]);

								hangmanEmbed.edit({
									embed: firstEmbed
								});
								return msg.reply('You lost!');
							}
						}
					} else {
						/* eslint no-lonely-if: 0 */
						if (wordToGuess.length === response.first().content.length) {
							if (wordToGuess === response.first().content.toLowerCase()) {
								firstEmbed.setTitle(`You're right! 😄`);
								firstEmbed.setFooter(`${chances}/15 Chances left`);
								firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${wordToGuess}\`\`\``);

								hangmanEmbed.edit({
									embed: firstEmbed
								});
								return msg.reply('You won!');
							}

							chances -= 1;
							firstEmbed.setTitle(`You're not right! 😢`);
							firstEmbed.setFooter(`${chances}/15 Chances left`);
							firstEmbed.setDescription(`**Tried letters:** ${triedLetters.join(', ')}\n\n**Word to guess:**\n \`\`\`${newWordString.join(' ')}\`\`\``);
							firstEmbed.setImage(hangmanPictures[15 - chances]);

							hangmanEmbed.edit({
								embed: firstEmbed
							});
						} else {
							msg.reply(`The word must have ${wordToGuess.length} characters!`);
						}
					}
				} else {
					msg.reply('not a letter!');
				}
			} catch (error) {
				return msg.channel.send(`You didn't give an answer`);
			}
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	shortDescription: 'Games',
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'hangman',
	description: '',
	usage: '',
	example: [''],
	category: 'fun',
	botpermissions: ['SEND_MESSAGES']
};
