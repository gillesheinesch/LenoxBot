/* eslint-disable no-restricted-syntax */
const Discord = require('discord.js');
const settings = require('../settings.json');

module.exports = {
  run: async (oldMember, newMember) => {
    if (!client.provider.isReady) return;
    if (!client.provider.getGuild(newMember.guild.id, 'prefix')) return;

    const validationForPremium = ['administrator', 'moderator', 'developer', 'pr manager', 'pr agent', 'moderator', 'test-moderator', 'translation manager', 'translation proofreader', 'designer'];
    const validationForDoubleDailyAndLoot = ['issue judger', 'beta tester'];

    const lang = require(`../languages/${client.provider.getGuild(newMember.guild.id, 'language')}.json`);
    if (oldMember.nickname !== newMember.nickname) {
      const currentNicknamelog = client.provider.getGuild(newMember.guild.id, 'nicknamelog');
      currentNicknamelog.push(newMember.id);
      currentNicknamelog.push(oldMember.nickname === null ? lang.guildmemberupdateevent_nonickname : oldMember.nickname);
      currentNicknamelog.push(newMember.nickname === null ? lang.guildmemberupdateevent_nonickname : newMember.nickname);
      currentNicknamelog.push(new Date().getTime());
      await client.provider.setGuild(newMember.guild.id, 'nicknamelog', currentNicknamelog);
    }

    // SEND SINGLE MESSAGE
    /*  Why is this?
    const user = {
      id: newMember.user.id, username: newMember.user.username, discriminator: newMember.user.discriminator, avatar: newMember.user.avatar
    };
    const singleMessage = { type: 'single', data: user };
    process.send(singleMessage);
    */

    if (client.provider.getGuild(newMember.guild.id, 'guildmemberupdatelog') === 'false') return;

    const messagechannel = client.channels.get(client.provider.getGuild(newMember.guild.id, 'guildmemberupdatelogchannel'));

    if (oldMember.nickname !== newMember.nickname) {
      const embed = new Discord.MessageEmbed()
        .setColor('ORANGE')
        .setTimestamp()
        .setAuthor(lang.guildmemberupdateevent_nicknamechanged)
        .addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`)
        .addField(`📤${lang.guildmemberupdateevent_oldnickname}`, oldMember.nickname === null ? lang.guildmemberupdateevent_membernonickname : oldMember.nickname)
        .addField(`📥 ${lang.guildmemberupdateevent_newnickname}`, newMember.nickname === null ? lang.guildmemberupdateevent_nicknamereset : newMember.nickname);
      messagechannel.send({
        embed
      });
    }


    if (oldMember.roles.size < newMember.roles.size) {
      const embed = new Discord.MessageEmbed()
        .setColor('ORANGE')
        .setTimestamp()
        .setAuthor(lang.guildmemberupdateevent_roleassigned)
        .addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`);

      for (const role of newMember.roles.map((x) => x.id)) {
        if (!oldMember.roles.has(role)) {
          embed.addField(`📥 ${lang.guildmemberupdateevent_role}`, `${oldMember.guild.roles.get(role).name}`);

          if (newMember.guild.id === settings.botMainDiscordServer && validationForPremium.includes(oldMember.guild.roles.get(role).name.toLowerCase())) {
            const currentPremium = client.provider.getUser(oldMember.id, 'premium');

            if (currentPremium.status === false) {
              const now = new Date().getTime();

              currentPremium.status = true;
              currentPremium.bought.push(new Date().getTime);
              currentPremium.end = new Date(now + 3154000000000000);
              await client.provider.setUser(oldMember.id, 'premium', currentPremium);

              const embed2 = new Discord.MessageEmbed()
                .setDescription('This LenoxBot team member was automatically credited with LenoxBot Premium!')
                .setAuthor(oldMember.user.tag, oldMember.user.displayAvatarURL())
                .setTimestamp()
                .setColor('GREEN')
                .setTitle('Userkey used!');
              await client.channels.get(settings.keychannel).send({ embed: embed2 });
            }
          }

          if (newMember.guild.id === settings.botMainDiscordServer && validationForDoubleDailyAndLoot.includes(oldMember.guild.roles.get(role).name.toLowerCase())) {
            const currentDoubleLootAndDaily = client.provider.getUser(oldMember.id, 'doubleLootAndDaily');

            if (currentDoubleLootAndDaily === false) {
              await client.provider.setUser(oldMember.id, 'doubleLootAndDaily', true);

              const doubleLootAndDailyEmbed = new Discord.MessageEmbed()
                .setDescription('This user member was automatically credited with LenoxBot double loot and daily!')
                .setAuthor(oldMember.user.tag, oldMember.user.displayAvatarURL())
                .setTimestamp()
                .setColor('GREEN')
                .setTitle('Userkey used!');
              await client.channels.get(settings.keychannel).send({ embed: doubleLootAndDailyEmbed });
            }
          }
        }
      }

      messagechannel.send({
        embed
      });
    }

    if (oldMember.roles.size > newMember.roles.size) {
      const embed = new Discord.MessageEmbed()
        .setColor('ORANGE')
        .setTimestamp()
        .setAuthor(lang.guildmemberupdateevent_roleremoved)
        .addField(`📎 ${lang.guildmemberupdateevent_member}`, `${oldMember.user.tag} (${oldMember.id})`);

      for (const role of oldMember.roles.map((x) => x.id)) {
        if (!newMember.roles.has(role)) {
          embed.addField(`📥 ${lang.guildmemberupdateevent_role}`, `${oldMember.guild.roles.get(role).name}`);

          if (newMember.guild.id === settings.botMainDiscordServer && validationForPremium.includes(oldMember.guild.roles.get(role).name.toLowerCase())) {
            const currentPremium = client.provider.getUser(oldMember.id, 'premium');

            const isTeamMember = false;
            for (let i = 0; i < newMember.roles.array().length; i += 1) {
              if (validationForPremium.includes(newMember.roles.array()[i].name.toLowerCase())) {
                isTeamMember = true;
              }
            }


            if (currentPremium.status === true && !isTeamMember) {
              currentPremium.status = false;
              currentPremium.bought = [];
              currentPremium.end = '';
              await client.provider.setUser(oldMember.id, 'premium', currentPremium);

              const embed = new Discord.MessageEmbed()
                .setDescription('This LenoxBot team member was automatically deducted with LenoxBot Premium!')
                .setAuthor(oldMember.user.tag, oldMember.user.displayAvatarURL())
                .setTimestamp()
                .setColor('RED')
                .setTitle('Userkey removed!');
              await client.channels.get(settings.keychannel).send({ embed });
            }
          }

          if (newMember.guild.id === settings.botMainDiscordServer && validationForDoubleDailyAndLoot.includes(oldMember.guild.roles.get(role).name.toLowerCase())) {
            const currentDoubleLootAndDaily = client.provider.getUser(oldMember.id, 'doubleLootAndDaily');

            const isTeamMember = false;
            for (let i = 0; i < newMember.roles.array().length; i += 1) {
              if (validationForDoubleDailyAndLoot.includes(newMember.roles.array()[i].name.toLowerCase())) {
                isTeamMember = true;
              }
            }

            if (currentDoubleLootAndDaily === true && !isTeamMember) {
              await client.provider.setUser(oldMember.id, 'doubleLootAndDaily', false);

              const doubleLootAndDailyEmbed = new Discord.MessageEmbed()
                .setDescription('This user member was automatically deducted with LenoxBot double loot and daily!')
                .setAuthor(oldMember.user.tag, oldMember.user.displayAvatarURL())
                .setTimestamp()
                .setColor('RED')
                .setTitle('Userkey removed!');
              await client.channels.get(settings.keychannel).send({ embed: doubleLootAndDailyEmbed });
            }
          }
        }
      }

      messagechannel.send({
        embed
      });
    }
  }
};
