const Discord = require('discord.js');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class tictactoeCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'tictactoe',
      group: 'fun',
      memberName: 'tictactoe',
      description: 'Play a round of TicTacToe against another Discord user',
      format: 'tictactoe {@User}',
      aliases: ['ttt'],
      examples: ['tictactoe @Tester#7584'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const mention = msg.mentions.members.first();
    const validation = [0, 0, 0, 0, 0, 0, 0, 0, 0];

    if (!mention) return msg.channel.send(lang.tictactoe_nomention);
    if (mention.presence.status === 'offline') return msg.reply(lang.tictactoe_notoline);
    if (mention.user.bot) return msg.channel.send(lang.tictactoe_botmention);
    if (msg.author.id === mention.id) return msg.channel.send(lang.tictactoe_error);

    let wantToPlayMessage;
    let wantToPlay;
    try {
      const wannaplay = lang.tictactoe_wannaplay.replace('%mention', mention).replace('%author', msg.author);
      wantToPlayMessage = await msg.channel.send(wannaplay);
      wantToPlay = await msg.channel.awaitMessages((msg2) => msg2.author.id === mention.id, {
        max: 1,
        time: 60000,
        errors: ['time']
      });
    }
    catch (error) {
      return wantToPlayMessage.delete();
    }

    if (wantToPlay.first().content.toLowerCase() !== 'yes') {
      const gamecanceled = lang.tictactoe_gamecanceled.replace('%mention', mention.user.tag);
      return msg.reply(gamecanceled);
    }

    await wantToPlayMessage.delete();
    await wantToPlay.first().delete();

    await msg.channel.send(`${lang.tictactoe_gamecreated} 😼`);
    let gameEmbed = new Discord.MessageEmbed()
      .setTitle(lang.tictactoe_title)
      .setDescription('``` 1 | 2 | 3 \n---|---|--  \n 4 | 5 | 6 \n---|---|--  \n 7 | 8 | 9```')
      .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
      .setColor('BLUE');
    const game = await msg.channel.send({
      embed: gameEmbed
    });

    try {
      const yourTurnMessage = await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 1;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', mention).replace('%author', msg.author);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 2;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author).replace('%author', mention);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 1;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', mention).replace('%author', msg.author);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 2;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author).replace('%author', mention);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 1;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', mention).replace('%author', msg.author);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 2;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author).replace('%author', mention);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    const winnerEmbed = new Discord.MessageEmbed()
      .setTitle(lang.tictactoe_gameend)
      .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
      .setColor('GREEN');

    if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 1;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', mention).replace('%author', msg.author);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${mention}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg2.author.id === mention.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 2;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', msg.author).replace('%author', mention);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    }

    try {
      const yourTurnMessage = await msg.channel.send(`${msg.author}, ${lang.tictactoe_turn} ‼`);
      const response1 = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id && msg2.content > 0 && msg2.content < 10 && validation[msg2.content - 1] === 0, {
        max: 1,
        time: 15000,
        errors: ['time']
      });

      await yourTurnMessage.delete();
      await response1.first().delete();

      const editedDescription = gameEmbed.description.replace(response1.first().content, response1.first().author.id === msg.author.id ? 'X' : 'O');
      gameEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_title)
        .setDescription(editedDescription)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('BLUE');

      await game.edit({
        embed: gameEmbed
      });
      validation[response1.first().content - 1] = 1;
    }
    catch (error) {
      const noanswer = lang.tictactoe_noanswer.replace('%user', mention).replace('%author', msg.author);
      const noAnswerEmbed = new Discord.MessageEmbed()
        .setTitle(lang.tictactoe_noanswertitle)
        .setDescription(noanswer)
        .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
        .setColor('RED');
      return msg.channel.send({
        embed: noAnswerEmbed
      });
    }

    if (validation[0] === 1 && validation[1] === 1 && validation[2] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[5] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 1 && validation[7] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[3] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 1 && validation[4] === 1 && validation[8] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 1 && validation[4] === 1 && validation[7] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 1 && validation[4] === 1 && validation[6] === 1) {
      const win = lang.tictactoe_win.replace('%user', msg.author);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[1] === 2 && validation[2] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[5] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[6] === 2 && validation[7] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[3] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[0] === 2 && validation[4] === 2 && validation[8] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[2] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[1] === 2 && validation[4] === 2 && validation[7] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    } if (validation[3] === 2 && validation[4] === 2 && validation[6] === 2) {
      const win = lang.tictactoe_win.replace('%user', mention);
      winnerEmbed.setDescription(win);
      return msg.channel.send({
        embed: winnerEmbed
      });
    }
    const drawEmbed = new Discord.MessageEmbed()
      .setTitle(lang.tictactoe_gameend)
      .setDescription(lang.tictactoe_draw)
      .setFooter(`${msg.author.tag} vs ${mention.user.tag}`)
      .setColor('ORANGE');

    return msg.channel.send({
      embed: drawEmbed
    });
  }
};
