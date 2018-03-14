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
					archiv.send(`The proposal was accepted and was succesfully included in the trello grid
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
				  archiv.send(`The proposal was rejected and was succesfully included in the trello grid
				  \`\`\`${messageReaction.message.cleanContent}\`\`\`
				  `);
				  return messageReaction.message.delete();
			  }
		  });
	  }
	}
};
