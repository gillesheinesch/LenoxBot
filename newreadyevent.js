const Discord = require('discord.js');

module.exports = {
  run: () => {
    const chalk = require('chalk');

    const users = [];
    for (const discordUser of client.users.array()) {
      const user = {
        id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator,
        avatar: discordUser.avatar
      };
      users.push(user);
    }
    const bulkMessage = {
      type: 'bulk',
      data: users
    };
    process.send(bulkMessage);

    client.ready = true;
    if (client.provider.isReady) {
      console.log(chalk.green('LenoxBot is ready!'));
      require('../bin/www');
    }
    else {
      client.provider.whenReady(async () => {
        console.log(chalk.green('LenoxBot is ready!'));
        console.log('tzestz');
        // require('../bin/www');
        console.log('zesz');
        var http = require('http');

        // The following 4 are the actual values that pertain to your account and this specific metric.
        var apiKey = 'bf5c8a5f-0db4-4de8-b857-e7cbef2396e1';
        var pageId = 'h9w5z6ysgc7f';
        var metricId = 'ylj331dftyzq';
        var apiBase = 'https://api.statuspage.io/v1';

        var url = `${apiBase}/pages/${pageId}/metrics/${metricId}/data.json`;
        var authHeader = { Authorization: `OAuth ${apiKey}` };
        var options = { method: 'POST', headers: authHeader };

        // Need at least 1 data point for every 5 minutes.
        // Submit random data for the whole day.
        var totalPoints = 60 / 5 * 24;
        var epochInSeconds = Math.floor(new Date() / 1000);

        // This function gets called every second.
        function submit(count) {
          count += 1;

          if (count > totalPoints) return;
          console.log(2);

          var currentTimestamp = epochInSeconds - (count - 1) * 5 * 60;
          var randomValue = Math.floor(Math.random() * 1000);
          console.log(22);

          var data = {
            timestamp: currentTimestamp,
            value: randomValue
          };
          console.log(222);

          var request = http.request(url, options, (res) => {
            console.log(res);
            res.on('data', () => {
              console.log(`Submitted point ${count} of ${totalPoints}`);
            });

            console.log(2222);
            res.on('end', () => {
              console.log(232);
              setTimeout(() => { submit(count); }, 1000);
            });
          });
          console.log(111)

          request.end(JSON.stringify({ data }));
        }

        // Initial call to start submitting data.
        console.log(1)
        submit(100);
        console.log(21);

        // Sets all marketitems
        const marketconfs = require('../marketitems-keys.json');
        await client.provider.setBotsettings('botconfs', 'market', marketconfs);

        // Sets the prefix for every guild
        for (let i = 0; i < client.guilds.array().length; i += 1) {
          if (client.provider.getGuild(client.guilds.array()[i].id, 'prefix')) {
            client.guilds.array()[i]._commandPrefix = client.provider.getGuild(client.guilds.array()[i].id, 'prefix');
          }
        }

        await client.provider.setBotsettings('botconfs', 'botstats', {
          botguildscount: client.guilds.size,
          botmemberscount: client.users.size,
          botcommands: client.provider.getBotsettings('botconfs', 'commandsexecuted'),
          botcommandsincrement: Math.floor(client.provider.getBotsettings('botconfs', 'commandsexecuted') / 170) + 1,
          botmemberscountincrement: Math.floor(client.users.size / 170) + 1,
          botguildscountincrement: Math.floor(client.guilds.size / 170) + 1
        });

        function timeoutForReminder(reminder, timeoutTime) {
          setTimeout(async () => {
            const currentReminder2 = client.provider.getUser(reminder.userId, 'currentReminder');
            const indexOfRemind = currentReminder2.indexOf(reminder.id);
            currentReminder2.splice(indexOfRemind, 1);
            await client.provider.setUser(reminder.userId, 'currentReminder', currentReminder2);

            const currentReminders2 = client.provider.getBotsettings('botconfs', 'reminder');
            delete currentReminders2[reminder.id];
            await client.provider.setBotsettings('botconfs', 'reminder', currentReminders2);

            const langSet = client.provider.getGuild(reminder.guildId, 'language');
            const lang = require(`../languages/${langSet}.json`);
            const remindPassedEmbed = new Discord.MessageEmbed()
              .setColor('BLUE')
              .setTimestamp()
              .setTitle(lang.remind_embedremindpassed)
              .setDescription(`${lang.remind_addembedtext}: ${reminder.text}`);

            client.channels.get(reminder.channelId).send({
              reply: reminder.userId,
              embed: remindPassedEmbed
            });
          }, timeoutTime);
        }

        if (typeof client.provider.getBotsettings('botconfs', 'reminder') !== 'undefined') {
          if (Object.keys(client.provider.getBotsettings('botconfs', 'reminder')).length !== 0) {
            /* eslint guard-for-in: 0 */
            for (const index in client.provider.getBotsettings('botconfs', 'reminder')) {
              const timeoutTime = client.provider.getBotsettings('botconfs', 'reminder')[index].remindEndDate - Date.now();
              timeoutForReminder(client.provider.getBotsettings('botconfs', 'reminder')[index], timeoutTime);
            }
          }
        }

        function timeoutForDaily(dailyreminder, timeoutTime) {
          setTimeout(async () => {
            client.users.get(dailyreminder.userID).send('Don\'t forget to pick up your daily reward');
            const currentDailyreminder = client.provider.getBotsettings('botconfs', 'dailyreminder');
            delete currentDailyreminder[dailyreminder.userID];
            await client.provider.setBotsettings('botconfs', 'dailyreminder', currentDailyreminder);
          }, timeoutTime);
        }

        if (typeof client.provider.getBotsettings('botconfs', 'dailyreminder') !== 'undefined') {
          if (Object.keys(client.provider.getBotsettings('botconfs', 'dailyreminder')).length !== 0) {
            /* eslint guard-for-in: 0 */
            for (const index in client.provider.getBotsettings('botconfs', 'dailyreminder')) {
              const timeoutTime = client.provider.getBotsettings('botconfs', 'dailyreminder')[index].remind - Date.now();
              timeoutForDaily(client.provider.getBotsettings('botconfs', 'dailyreminder')[index], timeoutTime);
            }
          }
        }

        function timeoutForJob(jobreminder, timeoutTime) {
          setTimeout(async () => {
            await client.provider.setUser(jobreminder.userID, 'jobstatus', false);

            const newCurrentJobreminder = client.provider.getBotsettings('botconfs', 'jobreminder');
            delete newCurrentJobreminder[jobreminder.userID];
            await client.provider.setBotsettings('botconfs', 'jobreminder', newCurrentJobreminder);

            let currentCredits = client.provider.getUser(jobreminder.userID, 'credits');
            currentCredits += jobreminder.amount;
            await client.provider.setUser(jobreminder.userID, 'credits', currentCredits);

            const jobfinish = `Congratulations! You have successfully completed your job. You earned a total of ${jobreminder.amount} credits`;
            client.users.get(jobreminder.userID).send(jobfinish);

            const activityEmbed2 = new Discord.MessageEmbed()
              .setAuthor(`${client.users.get(jobreminder.userID).tag} (${jobreminder.userID})`, client.users.get(jobreminder.userID).displayAvatarURL())
              .setDescription(`**Job:** ${jobreminder.job} \n**Duration:** ${jobreminder.jobtime} minutes \n**Amount:** ${jobreminder.amount} credits`)
              .addField('Guild', `${client.guilds.get(jobreminder.discordServerID).name} (${jobreminder.discordServerID})`)
              .addField('Channel', `${client.channels.get(jobreminder.channelID).name} (${jobreminder.channelID})`)
              .setColor('AQUA')
              .setFooter('JOB FINISHED')
              .setTimestamp();
            if (client.provider.getBotsettings('botconfs', 'activity') === true) {
              const messagechannel = client.channels.get(client.provider.getBotsettings('botconfs', 'activitychannel'));
              messagechannel.send({
                embed: activityEmbed2
              });
            }
          }, timeoutTime);
        }

        if (typeof client.provider.getBotsettings('botconfs', 'jobreminder') !== 'undefined') {
          if (Object.keys(client.provider.getBotsettings('botconfs', 'jobreminder')).length !== 0) {
            /* eslint guard-for-in: 0 */
            for (const index in client.provider.getBotsettings('botconfs', 'jobreminder')) {
              const timeoutTime = client.provider.getBotsettings('botconfs', 'jobreminder')[index].remind - Date.now();
              timeoutForJob(client.provider.getBotsettings('botconfs', 'jobreminder')[index], timeoutTime);
            }
          }
        }

        function timeoutForBan(bansconf, newBanTime, fetchedbansfromfunction) {
          setTimeout(async () => {
            const langSet = client.provider.getGuild(bansconf.discordserverid, 'language');
            const lang = require(`../languages/${langSet}.json`);
            const fetchedbans = fetchedbansfromfunction;

            if (fetchedbans.has(bansconf.memberid)) {
              const user = client.users.get(bansconf.memberid);

              client.guilds.get(bansconf.discordserverid).members.unban(bansconf.memberid);

              const unbannedby = lang.unban_unbannedby.replace('%authortag', `${client.user.tag}`);
              const automaticbandescription = lang.temporaryban_automaticbandescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
              const unmutedembed = new Discord.MessageEmbed()
                .setAuthor(unbannedby, client.user.displayAvatarURL())
                .setThumbnail(user.displayAvatarURL())
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(automaticbandescription);

              if (client.provider.getGuild(bansconf.discordserverid, 'modlog') === 'true') {
                const modlogchannel = client.channels.get(client.provider.getGuild(bansconf.discordserverid, 'modlogchannel'));
                modlogchannel.send({
                  embed: unmutedembed
                });
              }

              const currentPunishments = client.provider.getGuild(bansconf.discordserverid, 'punishments');
              const punishmentConfig = {
                id: currentPunishments.length + 1,
                userId: user.id,
                reason: lang.temporaryban_automaticunban,
                date: Date.now(),
                moderatorId: client.user.id,
                type: 'unban'
              };

              currentPunishments.push(punishmentConfig);
              await client.provider.setGuild(bansconf.discordserverid, 'punishments', currentPunishments);
            }
            const newbansconf = client.provider.getBotsettings('botconfs', 'bans');
            delete newbansconf[client.provider.getBotsettings('botconfs', 'banscount')];
            await client.provider.setBotsettings('botconfs', 'bans', newbansconf);
          }, newBanTime);
        }

        function timeoutForMute(muteconf, newMuteTime) {
          setTimeout(async () => {
            const guild = client.guilds.get(muteconf.discordserverid);
            if (!guild) return;

            const membermention = await guild.members.fetch(muteconf.memberid).catch(() => undefined);
            if (!membermention) return undefined;

            const role = client.guilds.get(muteconf.discordserverid).roles.get(muteconf.roleid);
            if (!role) return undefined;

            const user = client.users.get(muteconf.memberid);
            if (!user) return undefined;

            const langSet = client.provider.getGuild(muteconf.discordserverid, 'language');
            const lang = require(`../languages/${langSet}.json`);

            if (client.provider.getGuild(muteconf.discordserverid, 'muterole') !== '' && membermention.roles.has(client.provider.getGuild(muteconf.discordserverid, 'muterole'))) {
              membermention.roles.remove(role);

              const unmutedby = lang.unmute_unmutedby.replace('%authortag', `${client.user.tag}`);
              const automaticunmutedescription = lang.unmute_automaticunmutedescription.replace('%usertag', `${user.username}#${user.discriminator}`).replace('%userid', user.id);
              const unmutedembed = new Discord.MessageEmbed()
                .setAuthor(unmutedby, client.user.displayAvatarURL())
                .setThumbnail(user.displayAvatarURL())
                .setColor('#FF0000')
                .setTimestamp()
                .setDescription(automaticunmutedescription);

              user.send({
                embed: unmutedembed
              });

              if (client.provider.getGuild(muteconf.discordserverid, 'modlog') === 'true') {
                const modlogchannel = client.channels.get(client.provider.getGuild(muteconf.discordserverid, 'modlogchannel'));
                modlogchannel.send({
                  embed: unmutedembed
                });
              }

              const currentPunishments = client.provider.getGuild(muteconf.discordserverid, 'punishments');
              const punishmentConfig = {
                id: currentPunishments.length + 1,
                userId: user.id,
                reason: lang.mute_automaticunmute,
                date: Date.now(),
                moderatorId: client.user.id,
                type: 'unmute'
              };

              currentPunishments.push(punishmentConfig);
              await client.provider.setGuild(muteconf.discordserverid, 'punishments', currentPunishments);
            }
            const newmuteconf = client.provider.getBotsettings('botconfs', 'mutes');
            delete newmuteconf[muteconf.mutescount];
            await client.provider.setBotsettings('botconfs', 'mutes', newmuteconf);
          }, newMuteTime);
        }

        if (typeof client.provider.getBotsettings('botconfs', 'bans') !== 'undefined') {
          if (Object.keys(client.provider.getBotsettings('botconfs', 'bans')).length !== 0) {
            for (const index in client.provider.getBotsettings('botconfs', 'bans')) {
              const newBanTime = client.provider.getBotsettings('botconfs', 'bans')[index].banEndDate - Date.now();
              const fetchedbans = await client.guilds.get(client.provider.getBotsettings('botconfs', 'bans')[index].discordserverid).fetchBans();
              timeoutForBan(client.provider.getBotsettings('botconfs', 'bans')[index], newBanTime, fetchedbans);
            }
          }
        }


        if (typeof client.provider.getBotsettings('botconfs', 'mutes') !== 'undefined') {
          if (Object.keys(client.provider.getBotsettings('botconfs', 'mutes')).length !== 0) {
            for (const index2 in client.provider.getBotsettings('botconfs', 'mutes')) {
              const newMuteTime = client.provider.getBotsettings('botconfs', 'mutes')[index2].muteEndDate - Date.now();
              timeoutForMute(client.provider.getBotsettings('botconfs', 'mutes')[index2], newMuteTime);
            }
          }
        }
        setInterval(() => {
          client.guilds.filter((g) => client.provider.getGuild(g.id, 'prefix')).forEach(async (g) => {
            if (client.provider.getGuild(g.id, 'premium')) {
              if (client.provider.getGuild(g.id, 'premium').status === true) {
                if (new Date().getTime() >= Date.parse(client.provider.getGuild(g.id, 'premium').end)) {
                  const currentPremium = client.provider.getGuild(g.id, 'premium');
                  currentPremium.status = false;
                  currentPremium.bought = [];
                  currentPremium.end = '';
                  await client.provider.setGuild(g.id, 'premium', currentPremium);
                }
              }
            }
          });
        }, 86400000);

        setInterval(() => {
          client.users.filter((g) => client.provider.getUser(g.id, 'credits')).forEach(async (g) => {
            if (client.provider.getUser(g.id, 'premium')) {
              if (client.provider.getUser(g.id, 'premium').status === true) {
                if (new Date().getTime() >= Date.parse(client.provider.getUser(g.id, 'premium').end)) {
                  const currentPremium = client.provider.getUser(g.id, 'premium');
                  currentPremium.status = false;
                  currentPremium.bought = [];
                  currentPremium.end = '';
                  await client.provider.setUser(g.id, 'premium', currentPremium);
                }
              }
            }
          });
        }, 86400000);

        const validation = ['administration', 'help', 'music', 'fun', 'searches', 'nsfw', 'utility', 'botowner', 'moderation', 'staff', 'application', 'currency', 'partner', 'tickets', 'customcommands'];
        const commandsArray = [];
        const englishLang = require('../languages/en-US.json');
        for (let i = 0; i < validation.length; i += 1) {
          for (let index = 0; index < client.registry.commands.filter((c) => c.groupID === validation[i]).array().length; index += 1) {
            const commandObject = {};
            commandObject.category = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].groupID;
            commandObject.name = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name;
            commandObject.description = englishLang[`${client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name}_description`] ? englishLang[`${client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name}_description`] : client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name.description;
            commandObject.newaliases = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].aliases;
            commandObject.newuserpermissions = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].userpermissions;
            commandObject.usage = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].format;
            commandObject.dashboardsettings = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].dashboardsettings;
            commandsArray.push(commandObject);
          }
        }
        await client.provider.setBotsettings('botconfs', 'commands', commandsArray);

        setInterval(async () => {
          const commandsArray2 = [];
          for (let i = 0; i < validation.length; i += 1) {
            for (let index = 0; index < client.registry.commands.filter((c) => c.groupID === validation[i]).array().length; index += 1) {
              const commandObject = {};
              commandObject.category = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].groupID;
              commandObject.name = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name;
              commandObject.description = englishLang[`${client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name}_description`] ? englishLang[`${client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name}_description`] : client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].name.description;
              commandObject.newaliases = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].aliases;
              commandObject.newuserpermissions = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].userpermissions;
              commandObject.usage = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].format;
              commandObject.dashboardsettings = client.registry.commands.filter((c) => c.groupID === validation[i]).array()[index].dashboardsettings;
              commandsArray2.push(commandObject);
            }
          }
          await client.provider.setBotsettings('botconfs', 'commands', commandsArray2);
        }, 86400000);

        // Creditsranklist leaderboard
        /* let userInfo = [];
				const userSettingsList = await client.provider.userSettings;
				for (const key of userSettingsList) {
					if (!isNaN(key[1].credits) && client.users.get(key[0])) {
						const userResult = client.users.get(key[0]);
						const userCreditsSettings = {
							userId: key[0],
							user: userResult ? userResult : key[0],
							credits: Number(key[1].credits),
							rank: 0
						};
						if (key[0] !== 'global') {
							userInfo.push(userCreditsSettings);
						}
					}
				}
				userInfo = userInfo.sort((a, b) => {
					if (a.credits < b.credits) {
						return 1;
					}
					if (a.credits > b.credits) {
						return -1;
					}
					return 0;
				});
				for (let i = 0; i < userInfo.length; i += 1) {
					userInfo[i].rank = (i + 1);
				}
				await client.provider.setBotsettings('botconfs', 'top100credits', userInfo); */

        const embed = new Discord.MessageEmbed()
          .setTitle('Botrestart')
          .setDescription('LenoxBot had a restart and is back again!\nEveryone can now execute commands!')
          .setColor('GREEN')
          .setTimestamp()
          .setAuthor(client.user.tag, client.user.displayAvatarURL());

        if (client.user.id === '354712333853130752') {
          client.channels.get('497400107109580801').send({
            embed
          });
        }
      });
    }
  }
};
