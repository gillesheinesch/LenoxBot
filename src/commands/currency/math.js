const Discord = require('discord.js');
const math = require('math-expression-evaluator');
const LenoxCommand = require('../LenoxCommand.js');

module.exports = class mathCommand extends LenoxCommand {
  constructor(client) {
    super(client, {
      name: 'math',
      group: 'currency',
      memberName: 'math',
      description: 'Solve mathematical calculations to get credits',
      format: 'math',
      aliases: [],
      examples: ['math'],
      clientpermissions: ['SEND_MESSAGES'],
      userpermissions: [],
      shortDescription: 'Games',
      dashboardsettings: true
    });
  }

  async run(msg) {
    const langSet = msg.client.provider.getGuild(msg.guild.id, 'language');
    const lang = require(`../../languages/${langSet}.json`);

    const randomForNumbers = Math.random();
    let firstNumber;
    let secondNumber;

    if (randomForNumbers <= 0.33) {
      firstNumber = Math.floor(Math.random() * 10) + Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5);
      secondNumber = Math.floor(Math.random() * 15) + Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5);
    }
    else if (randomForNumbers <= 0.66) {
      firstNumber = Math.floor(Math.random() * 10) - Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5);
      secondNumber = Math.floor(Math.random() * 15) + Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5);
    }
    else if (randomForNumbers <= 1) {
      firstNumber = Math.floor(Math.random() * 10) - Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5);
      secondNumber = Math.floor(Math.random() * 15) - Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5);
    }

    const signs = ['+', '-', '*'];
    const sign = Math.floor(Math.random() * signs.length);

    const embed = new Discord.MessageEmbed()
      .setFooter(msg.author.tag)
      .setTitle(lang.math_embedauthor)
      .setColor('#3399ff')
      .setDescription(`**${Number(firstNumber) < 0 ? `(${firstNumber})` : firstNumber} ${signs[sign]} ${Number(secondNumber) < 0 ? `(${secondNumber})` : secondNumber}**`);

    await msg.channel.send({
      embed
    });

    let response;
    try {
      response = await msg.channel.awaitMessages((msg2) => msg.author.id === msg2.author.id, {
        max: 1,
        time: 7000,
        errors: ['time']
      });
    }
    catch (error) {
      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits -= 10;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      return msg.reply(lang.math_timepassed);
    }

    const mathCalculation = await math.eval(`${firstNumber} ${signs[sign]} ${secondNumber}`);

    if (mathCalculation === Number(response.first().content)) {
      const currentMathematics = msg.client.provider.getUser(msg.author.id, 'mathematics');
      currentMathematics.points += 2;
      await msg.client.provider.setUser(msg.author.id, 'mathematics', currentMathematics);

      const mathLevel = Math.floor(1.5 * Math.sqrt(msg.client.provider.getUser(msg.author.id, 'mathematics').points + 1));
      if (mathLevel > msg.client.provider.getUser(msg.author.id, 'mathematics').level) {
        const currentMathematics2 = msg.client.provider.getUser(msg.author.id, 'mathematics');
        currentMathematics2.level = mathLevel;
        await msg.client.provider.setUser(msg.author.id, 'mathematics', currentMathematics2);
      }

      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits += 15 + Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5);
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      const winauthor = lang.math_winauthor.replace('%amount', 15 + Math.floor(msg.client.provider.getUser(msg.author.id, 'mathematics').level / 5));
      const embeddescription = lang.math_embeddescription.replace('%points', msg.client.provider.getUser(msg.author.id, 'mathematics').points).replace('%level', msg.client.provider.getUser(msg.author.id, 'mathematics').level);
      const winnerEmbed = new Discord.MessageEmbed()
        .setColor('#00ff00')
        .setFooter(msg.author.tag)
        .setTitle(winauthor)
        .setDescription(embeddescription);

      msg.channel.send({
        embed: winnerEmbed
      });
    }
    else {
      let currentCredits = msg.client.provider.getUser(msg.author.id, 'credits');
      currentCredits -= 10;
      await msg.client.provider.setUser(msg.author.id, 'credits', currentCredits);

      const embeddescription = lang.math_embeddescription.replace('%points', msg.client.provider.getUser(msg.author.id, 'mathematics').points).replace('%level', msg.client.provider.getUser(msg.author.id, 'mathematics').level);
      const loseauthor = lang.math_loseauthor.replace('%correct', mathCalculation);
      const loserEmbed = new Discord.MessageEmbed()
        .setColor('#ff0000')
        .setFooter(msg.author.tag)
        .setTitle(loseauthor)
        .setDescription(embeddescription);

      msg.channel.send({
        embed: loserEmbed
      });
    }
  }
};
