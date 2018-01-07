const Discord = require('discord.js');
exports.run = async(client, messageReaction, user) => {
	const trello = client.trello;
	if (messageReaction.message.channel.id === '372404583005290508') {
		if (messageReaction.emoji.name === '👍' && messageReaction.count === 2) {
			  var space = ' ';
			var text = messageReaction.message.cleanContent.split(space);

			var title = [];
			var context = [];
			for (var i = 0; i < text.length; i++) {
				if (text.indexOf('|') === i) {
					var xxx = i;
				} else if (i >= xxx) {
					context.push(text[i]);
				} else {
				title.push(text[i]);
			}
			}
			trello.addCard(title.join(' '), `**Proposal:** \n${context.join(' ')}`, '59ee178659ed95c44773d308',
			function (error, trelloCard) {
				if (error) {
					console.log(error);
					return messageReaction.message.channel.send('Error');
				}
				else {
					const archiv = client.channels.get('372404644623810560');
					archiv.send(`The proposal was accepted und was succesfully included in the trello grid
					\`\`\`${messageReaction.message.cleanContent}\`\`\`
					`);
					messageReaction.message.delete();
					const messagechannel = client.channels.get('354999866214318080');
					return messagechannel.send(`New proposal was succesfully included in the trello grid ${trelloCard.shortUrl} Write us your opinion on this proposal, thank you!`);
				}
			});
		}

		if (messageReaction.emoji.name === '👎' && messageReaction.count === 2) {
			const space = ' ';
		  const text = messageReaction.message.cleanContent.split(space);

		  var title2 = [];
		  var context2 = [];
		  for (var index = 0; index < text.length; index++) {
			  if (text.indexOf('|') === index) {
				var xxxx = index;
			  } else if (index >= xxxx) {
				  context2.push(text[index]);
			  } else {
			  title2.push(text[index]);
		  }
		  }
		  trello.addCard(title2.join(' '), `**Proposal:** \n${context2.join(' ')}`, '59ef5ca156376adce52354c7',
		  function (error, trelloCard) {
			  if (error) {
				  console.log(error);
				  return messageReaction.message.channel.send('Error');
			  }
			  else {
				  const archiv = client.channels.get('372404644623810560');
				  archiv.send(`The proposal was rejected und was succesfully included in the trello grid
				  \`\`\`${messageReaction.message.cleanContent}\`\`\`
				  `);
				  return messageReaction.message.delete();
			  }
		  });
	  }
	}

	if (messageReaction.message.channel.id === '372404616001880064') {
		if (messageReaction.emoji.name === '👍' && messageReaction.count === 2) {
			  var space = ' ';
			var text = messageReaction.message.cleanContent.split(space);

			var title = [];
			var context = [];
			for (var i = 0; i < text.length; i++) {
				if (text.indexOf('|') === i) {
					var xxx = i;
				} else if (i >= xxx) {
					context.push(text[i]);
				} else {
				title.push(text[i]);
			}
			}
			trello.addCard(title.join(' '), `**Bugreport:** \n${context.join(' ')}`, '59ef6ee0f7e744cff0058d8f',
			function (error, trelloCard) {
				if (error) {
					console.log(error);
					return messageReaction.message.channel.send('Error');
				}
				else {
					const archiv = client.channels.get('372404644623810560');
					archiv.send(`The bugreport was accepted und was succesfully included in the trello grid
					\`\`\`${messageReaction.message.cleanContent}\`\`\`
					`);
					messageReaction.message.delete();
					const messagechannel = client.channels.get('353993619096731649');
					return messagechannel.send(`New bugreport was succesfully included in the trello grid ${trelloCard.shortUrl} Write us more information about this bug report if you have any, thank you!`);
				}
			});
		}

		if (messageReaction.emoji.name === '👎' && messageReaction.count === 2) {
			const space = ' ';
		  const text = messageReaction.message.cleanContent.split(space);

		  var title2 = [];
		  var context2 = [];
		  for (var index = 0; index < text.length; index++) {
			  if (text.indexOf('|') === index) {
				var xxxx = index;
			  } else if (index >= xxxx) {
				  context2.push(text[index]);
			  } else {
			  title2.push(text[index]);
		  }
		  }
		  trello.addCard(title2.join(' '), `**Bugreport:** \n${context2.join(' ')}`, '59ef6eda38a2f7a1e1a94110',
		  function (error, trelloCard) {
			  if (error) {
				  console.log(error);
				  return messageReaction.message.channel.send('Error');
			  }
			  else {
				  const archiv = client.channels.get('372404644623810560');
				  archiv.send(`The bugreport was rejected und was succesfully included in the trello grid
				  \`\`\`${messageReaction.message.cleanContent}\`\`\`
				  `);
				  messageReaction.message.delete();
				  return messageReaction.message.channel.send('The bugreport was succesfully included in the trello grid').then(m => m.delete(10000));
			  }
		  });
	  }
	}

	const tableload = client.guildconfs.get(messageReaction.message.guild.id);

	// Definiert starboard und starboardchannel wenn das noch nicht getan wurde
	if (!tableload.starboard) {
		tableload.starboard === 'false';
		tableload.starboardchannel === '';
		await client.guildconfs.set(messageReaction.message.guild.id, tableload);
	}

	// Wenn starboard nicht aktiviert ist oder der Channel nicht festgelegt wurde, dann wird das Event hier abgebrochen
	if (tableload.starboardchannel === '') return;
	if (tableload.starboard === 'false') return;

	if (tableload.language === '') {
        tableload.language = 'en';
        client.guildconfs.set(messageReaction.message.guild.id, tableload);
	}

	var lang = require(`../languages/${tableload.language}.json`);

	// Wenn die Reaktion auf der Message :star: ist, führt er weiter aus
	if (messageReaction.emoji.name === '⭐') {
		// Wenn der, der auf die Message reactet hat, nicht der Author ist, dann...
		if (user.id === messageReaction.message.author.id) {
			messageReaction.remove(messageReaction.message.author);
			return messageReaction.message.channel.send(lang.messagereactionaddevent_error).then(m => m.delete(20000));
		}

		// Wenn es die erste :star: Reaktion ist
		if (messageReaction.count === 1) {
			const starboardchannel = client.channels.get(tableload.starboardchannel);

		const embed = new Discord.RichEmbed()
		.setColor('#a6a4a8')
		.setTimestamp()
		.setFooter(`⭐${messageReaction.count++}`)
		.setDescription(`**${lang.messagereactionaddevent_message}:** \n ${messageReaction.message.content}`)
		.setAuthor(`${messageReaction.message.author.tag} (${messageReaction.message.author.id})`, messageReaction.message.author.displayAvatarURL);

		if (messageReaction.message.attachments.size > 0) {
			var files = [];
			for (const attachment of messageReaction.message.attachments.values()) {
				files.push(attachment.url);
			}
			embed.setImage(files.toString());
		}
			starboardchannel.send({ embed }).then(m => client.starboard.set(messageReaction.message.id, {
				msgid: m.id,
				channel: m.channel.id
			}));
		} else if (messageReaction.count > 1) {
			const table = client.starboard.get(messageReaction.message.id);
			const starboardch = messageReaction.message.guild.channels.get(table.channel);

			const embed = new Discord.RichEmbed()
			.setColor('#a6a4a8')
			.setTimestamp()
			.setFooter(`⭐${messageReaction.count}`)
			.setDescription(`**Message:** \n ${messageReaction.message.content}`)
			.setAuthor(`${messageReaction.message.author.tag} (${messageReaction.message.author.id})`, messageReaction.message.author.displayAvatarURL);

			if (messageReaction.message.attachments.size > 0) {
				var files = [];
				for (const attachment of messageReaction.message.attachments.values()) {
					files.push(attachment.url);
				}
				embed.setImage(files.toString());
			}
			
			return starboardch.fetchMessage(table.msgid).then(m => m.edit({ embed }));
		}
	}
};
