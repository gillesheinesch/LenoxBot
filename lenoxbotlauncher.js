const Discord = require('discord.js');
const chalk = require('chalk');
const moment = require('moment');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-discord');
const handlebars = require('express-handlebars');
const handlebarshelpers = require('handlebars-helpers')();
const i18n = require('i18n');
const path = require('path');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const url = require('url');
const mongodb = require('mongodb');
const winston = require('winston');
const settings = require('./settings.json');
require('moment-duration-format');
const marketitemskeys = require('./marketitems-keys.json');

// Logger:
// TODO Review this logger
const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'log' })
  ],
  format: winston.format.printf((log) => `[${new Date().toLocaleString()}] - [${log.level.toUpperCase()}] - ${log.message}`)
});

const shardingManager = new Discord.ShardingManager('./lenoxbot.js', {
  token: settings.token
});

shardingManager.spawn().then(() => {
  winstonLogger.info(`[ShardManager] Started ${shardingManager.totalShards} shards`);
}).catch((error) => {
  winstonLogger.error(error);
});

// Website:
async function run() {
  // i18n conifguration
  i18n.configure({
    locales: ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'de-CH', 'tr-TR'],
    directory: `${__dirname}/languages`,
    defaultLocale: 'en-US',
    cookie: 'ulang'
  });

  const app = express();

  const mongoUrl = `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/?authMechanism=DEFAULT&authSource=admin`;
  const dbClient = await mongodb.MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  let db;
  if (settings.NODE_ENV === 'production') {
    db = dbClient.db('lenoxbot');
  }
  else {
    db = dbClient.db('betalenoxbot');
  }
  const guildSettingsCollection = db.collection('guildSettings');
  const userSettingsCollection = db.collection('userSettings');
  const botSettingsCollection = db.collection('botSettings');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
  }));
  app.use(cookieParser());

  app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    layoutsDir: `${__dirname}/views/layouts/`,
    helpers: handlebarshelpers
  }));

  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'handlebars');

  app.use(express.static('public'));

  app.use(i18n.init);

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  const scopes = ['identify', 'guilds'];

  passport.use(new Strategy({
    clientID: settings.clientID_Auth,
    clientSecret: settings.clientSecret_Auth,
    callbackURL: settings.callbackURL_Auth,
    scope: scopes
  }, ((accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
  })));

  app.use(session({
    secret: 'lenoxbot session secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ url: `mongodb://${encodeURIComponent(settings.db.user)}:${encodeURIComponent(settings.db.password)}@${encodeURIComponent(settings.db.host)}:${encodeURIComponent(settings.db.port)}/sessionStore?authMechanism=DEFAULT&authSource=admin` })
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/callback',
    passport.authenticate('discord', {
      failureRedirect: '/error'
    }),
    (req, res) => {
      res.redirect('/servers');
    });

  app.get('/loginpressedbutton', passport.authenticate('discord', {
    scope: scopes
  }));

  app.listen(settings.websiteport, (err) => {
    if (err) return winstonLogger.error(err);
    winstonLogger.info('Website running on https://lenoxbot.com');
  });

  // Script executes function on shard
  /** Executes a reload on the shards for synchronization
	 * @argument type the type of reloadable element - "guild", "user" or "botsettings"
	 * @argument id the id of the reloadable element, only usable on "guild" and "user"
	 */

  function islenoxboton(req) {
    const islenoxbot = [];
    if (req.user) {
      for (let i = 0; i < req.user.guilds.length; i += 1) {
        if (((req.user.guilds[i].permissions) && 8) === 8 && req.user.guilds[i].lenoxbot === true) {
          islenoxbot.push(req.user.guilds[i]);
        }
      }
    }
    return islenoxbot;
  }

  // Check all user guilds where lenoxbot is
  async function isLenoxBotAndUserOn(req) {
    const islenoxbotNonPerm = [];
    if (req.user) {
      for (let i = 0; i < req.user.guilds.length; i += 1) {
        let result;
        await shardingManager.broadcastEval(`this.guilds.get('${req.user.guilds[i].id}')`).then((guildArray) => {
          result = guildArray.find((g) => g);
        });

        if (result && typeof result !== 'undefined') {
          req.user.guilds[i].lenoxbot = true;
        }
        else {
          req.user.guilds[i].lenoxbot = false;
        }

        if (req.user.guilds[i].lenoxbot === true) {
          islenoxbotNonPerm.push(req.user.guilds[i]);
        }
      }
    }
    return islenoxbotNonPerm;
  }

  // findGuild function for broadcasteval
  function permissionsCheck(guildconfs, guild, req, res, index) {
    if (guildconfs.settings.dashboardpermissionroles.length !== 0 && guild.ownerID !== req.user.id) {
      let allwhitelistedrolesoftheuser = 0;

      for (let index2 = 0; index2 < guildconfs.settings.dashboardpermissionroles.length; index2++) {
        if (!guild.members.find((r) => r.userID === req.user.id)) return res.redirect('/servers');
        if (!guild.members.find((r) => r.userID === req.user.id).roles.includes(guildconfs.settings.dashboardpermissionroles[index2])) {
          allwhitelistedrolesoftheuser += 1;
        }
      }
      if (allwhitelistedrolesoftheuser === guildconfs.settings.dashboardpermissionroles.length) {
        return res.redirect('/servers');
      }
    }
    else if (((req.user.guilds[index].permissions) & 8) !== 8) {
      return res.redirect('/servers');
    }
  }

  async function betaAccessCheck(user, req, res) {
    if (user) {
      let guild;
      await shardingManager.broadcastEval(`this.guilds.get("${settings.botMainDiscordServer}")`)
        .then((guildArray) => {
          guild = guildArray.find((g) => g);
        });
      if (!guild) return res.redirect('/servers');

      const evaledMembersFromRole = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").roles.find(r => r.name.toLowerCase() === \'beta tester\').members.array()`);

      let betaAccess = false;
      evaledMembersFromRole.forEach((member) => {
        if (member.userID === req.user.id) betaAccess = true;
      });

      if (!betaAccess) {
        return false;
      }
      return true;
    }
  }

  async function reloadGuild(guild, dashboardid) {
    await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
        if (this.guilds.get("${dashboardid}")) {
        const x = await this.provider.reloadGuild("${dashboardid}");
        return x;
        }
    })();
`);
  }

  async function reloadUser(userId) {
    await shardingManager.broadcastEval(`
    (async () => {
        if (this.users.get("${userId}")) {
        const x = await this.provider.reloadUser("${userId}");
        return x;
        }
    })();
`);
  }

  async function reloadBotSettings(guild) {
    if (guild) {
      await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
        const x = await this.provider.reloadBotSettings();
        return x;
    })();
`);
    }
    else {
      await shardingManager.broadcastEval(`
    (async () => {
        const x = await this.provider.reloadBotSettings();
        return x;
    })();
`);
    }
  }

  function languages(req) {
    const languagesList = [{
      fileName: 'en-US',
      name: 'English',
      icon: 'us',
      status: false
    },
    {
      fileName: 'de-DE',
      name: 'German',
      icon: 'de',
      status: false
    },
    {
      fileName: 'fr-FR',
      name: 'French',
      icon: 'fr',
      status: false
    },
    {
      fileName: 'es-ES',
      name: 'Spanish',
      icon: 'es',
      status: false
    },
    {
      fileName: 'de-CH',
      name: 'Swiss',
      icon: 'ch',
      status: false
    },
    {
      fileName: 'tr-TR',
      name: 'Turkish',
      icon: 'tr',
      status: false
    }];

    const currentLanguage = req.getLocale();
    for (let i = 0; i < languagesList.length; i += 1) {
      if (languagesList[i].fileName === currentLanguage) {
        languagesList[i].status = true;
      }
    }
    return languagesList;
  }

  app.all('*', async (req, res, next) => {
    if (settings.NODE_ENV === 'development') {
      if (req.user) {
        const betaAccess = await betaAccessCheck(req.user, req, res);

        if (!betaAccess) {
          req.logOut();
          return res.redirect(url.format({
            pathname: '/error',
            query: {
              statuscode: 401,
              message: 'You are not a Beta Tester :('
            }
          }));
        }
      }
      next();
    }
    next();
  });

  app.get('/', async (req, res) => {
    try {
      const check = [];
      if (req.user) {
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (((req.user.guilds[i].permissions) && 8) === 8) {
            check.push(req.user.guilds[i]);
          }
        }
      }

      const lang = require(`./languages/website_${req.getLocale()}`);
      const ratingsQuotes = [];
      const ratingsCite = [];
      for (const x in lang) {
        if (x.includes('website_rating_quote')) {
          ratingsQuotes.push(lang[x]);
        }
        if (x.includes('website_rating_cite')) {
          const replaced = lang[x].replace('%', '');
          ratingsCite.push(replaced);
        }
      }

      const ratings = [];
      for (let i = 0; i < ratingsQuotes.length; i += 1) {
        ratings.push({ quote: ratingsQuotes[i], cite: ratingsCite[i] });
      }

      const islenoxbot = islenoxboton(req);
      const botConfs = await botSettingsCollection.findOne({
        botconfs: 'botconfs'
      });

      let evaledStats = await shardingManager.broadcastEval('[this.guilds.size, this.guilds.reduce((prev, guild) => prev + guild.memberCount, 0)]');

      let finalStats = {
        guilds: evaledStats.reduce((prev, data) => prev + data[0], 0),
        members: evaledStats.reduce((prev, data) => prev + data[1], 0)
      }

      return res.render('index', {
        languages: languages(req),
        lang,
        ratings,
        user: req.user,
        guilds: check,
        islenoxbot,
        botguildscount: finalStats.guilds,
        botmemberscount: finalStats.members,
        botcommands: botConfs.settings.botstats.botcommands
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/home', (req, res) => {
    try {
      return res.redirect(url.format({
        pathname: '/'
      }));
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/submitnewwebsitelanguage', async (req, res) => {
    try {
      res.cookie('ulang', req.body.newlanguage, {
        httpOnly: true,
        expires: new Date(Date.now() + 3.154e+10)
      });
      return res.redirect(req.get('referer'));
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  // Temp get for test dynamic pages in static mode

  app.get('/test', (req, res) => {
    try {
      const islenoxbot = islenoxboton(req);
      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('aatest', {
        languages: languages(req),
        lang,
        user: req.user,
        islenoxbot
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/invite', (req, res) => res.redirect('https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8'));

  app.get('/discord', (req, res) => res.redirect('https://discordapp.com/invite/jmZZQja'));

  app.get('/status', (req, res) => res.redirect('https://status.lenoxbot.com/'));

  app.get('/vote', (req, res) => {
    try {
      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('vote', {
        languages: languages(req),
        lang,
        user: req.user

      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/policy', (req, res) => {
    try {
      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('policy', {
        languages: languages(req),
        lang,
        user: req.user

      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dataprotection', (req, res) => {
    try {
      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('dataprotection', {
        languages: languages(req),
        lang,
        user: req.user

      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/ban', (req, res) => res.redirect('https://goo.gl/forms/NKoVsl8y5wOePCYT2'));

  app.get('/apply', (req, res) => res.redirect('https://goo.gl/forms/jOyjxAheOHaDYyoF2'));

  app.get('/survey', (req, res) => res.redirect('https://goo.gl/forms/2sS8U9JoYjeWHFF83'));

  app.get('/logout', (req, res) => {
    try {
      req.logOut();
      return res.redirect('/');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/leaderboards', async (req, res) => {
    try {
      const islenoxbot = islenoxboton(req);
      const islenoxbotnp = await isLenoxBotAndUserOn(req);

      const userData = {};
      const userArray = [];
      userData.loaded = false;

      const users = await userSettingsCollection.find().sort({
        'settings.credits': -1
      }).limit(100)
        .toArray();

      for (let i = 0; i < users.length; i += 1) {
        const user = {};
        user.userId = users[i].userId;
        user.credits = users[i].settings.credits;

        const userCheck = await shardingManager.shards.get(0).eval(`this.users.get("${users[i].userId}")`);

        if (userCheck) {
          user.user = userCheck;
        }

        userArray[i] = user;

        if (req.user) {
          if (userArray[i].userId === req.user.id) {
            userData.place = i + 1;
            userData.credits = userArray[i].credits;
            userData.loaded = true;

            if (userCheck) {
              userData.user = userCheck;
            }
          }
        }
      }

      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('leaderboard', {
        languages: languages(req),
        lang,
        user: req.user,
        credits: userArray,
        userData,
        islenoxbot,
        islenoxbotnp
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/leaderboards/server/:id', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      const guildconfs = await guildSettingsCollection.findOne({
        guildId: dashboardid
      });

      const userData = {};
      userData.loaded = false;

      const islenoxbot = islenoxboton(req);
      const islenoxbotnp = await isLenoxBotAndUserOn(req);

      let guild;
      await shardingManager.broadcastEval(`this.guilds.get("${req.params.id}")`)
        .then((guildArray) => {
          guild = guildArray.find((g) => g);
        });
      if (!guild) return res.redirect('/');

      let scores = [];

      for (const row in guildconfs.settings.scores) {
        const guildPointSettings = {
          userId: row,
          points: Number(guildconfs.settings.scores[row].points),
          level: Number(guildconfs.settings.scores[row].level)
        };
        if (row !== 'global') {
          scores.push(guildPointSettings);
        }
      }

      scores = scores.sort((a, b) => {
        if (a.points < b.points) {
          return 1;
        }
        if (a.points > b.points) {
          return -1;
        }
        return 0;
      });

      scores = scores.slice(0, 100);

      let user;
      for (let i = 0; i < scores.length; i += 1) {
        user = await shardingManager.shards.get(0).eval(`this.users.get("${scores[i].userId}")`);

        if (user) {
          scores[i].user = user;
        }
        if (req.user) {
          if (scores[i].userId === req.user.id) {
            userData.place = i + 1;
            userData.points = scores[i].points;
            userData.level = scores[i].level;
            userData.loaded = true;
          }
        }
      }

      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('leaderboard-guild', {
        languages: languages(req),
        lang,
        user: req.user,
        scores: scores.length === 0 ? null : scores,
        guild: guild || null,
        userData,
        islenoxbot,
        islenoxbotnp
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/profile/:id', async (req, res) => {
    try {
      const profileId = req.params.id;
      const userconfs = await userSettingsCollection.findOne({
        userId: profileId
      });
      const profileUser = await shardingManager.shards.get(0).eval(`
			(async () => {
			const fetchedUser = await this.users.fetch("${profileId}")
			if (fetchedUser) {
				return fetchedUser;
			}
			})();
	`);

      if (!userconfs || !profileUser) {
        return res.redirect(url.format({
          pathname: '/error',
          query: {
            statuscode: 204,
            message: 'This user could not be found by the bot or in the database. To fix this, try to write a message on any server where LenoxBot is on and can read your message!'
          }
        }));
      }

      let isstaff = false;
      let ispremium = false;
      const teamroles = ['administrator', 'developer', 'moderator', 'test-moderator', 'designer', 'translation manager', 'translation proofreader', 'pr manager'];

      let guild;
      await shardingManager.broadcastEval(`this.guilds.get("${settings.botMainDiscordServer}")`)
        .then((guildArray) => {
          guild = guildArray.find((g) => g);
        });

      const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").members.array()`);
      guild.members = evaledMembers;

      const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").channels.array()`);
      guild.channels = evaledChannels;

      for (let i = 0; i < teamroles.length; i += 1) {
        const roleMembers = await shardingManager.shards.get(guild.shardID).eval(`
					(() => {
						const roleFound = this.guilds.get("${settings.botMainDiscordServer}").roles.find(r => r.name.toLowerCase() === "${teamroles[i]}");
						if (roleFound) {
							const roleMembers = roleFound.members.array();
							return roleMembers;
						}
					})();
        `);
        if (roleMembers) {
          roleMembers.forEach((member) => {
            if (member.userID === profileId) {
              isstaff = true;
            }
          });
        }
      }
      if (userconfs.settings.premium.status) {
        ispremium = true;
      }
      if (!profileUser || !userconfs) throw Error('User was not found!');

      if (!userconfs.settings.description) {
        userconfs.settings.description = 'No description 😢';
      }
      if (!userconfs.settings.badges) {
        userconfs.settings.badges = [];
      }

      let badges;
      if (userconfs.settings.badges.length === 0) {
        badges = [];
      }
      else {
        const userBadges = userconfs.settings.badges;
        badges = userBadges.sort((a, b) => {
          if (a.rarity < b.rarity) {
            return 1;
          }
          if (a.rarity > b.rarity) {
            return -1;
          }
          return 0;
        });
      }

      const badgesAndTitles = [];
      for (let i = 0; i < badges.length; i += 1) {
        const settingsForBadgesAndTitles = {
          emoji: badges[i].emoji,
          name: badges[i].name
        };
        badgesAndTitles.push(settingsForBadgesAndTitles);
      }

      /*
			const useridsArray = [];
			const userArray = [];
			const moneyArray = [];
			const tempArray = [];
			const globalrank = [];
			rows.forEach(row => {
				useridsArray.push(row.userId);
				const member = client.users.get(row.userId);
				userArray.push(member ? member.tag : row.userId);
				moneyArray.push(row.medals);
			});
			for (let i = 0; i < userArray.length; i += 1) {
				tempArray.push((i + 1));
			}

			for (let index = 0; index < userArray.length; index += 1) {
				if (useridsArray[index] === req.params.id) {
					globalrank.push(tempArray[index]);
				}
			}
			*/

      const rowCredits = userconfs.settings.credits;

      const botconfs = await botSettingsCollection.findOne({
        botconfs: 'botconfs'
      });
      const marketconfs = botconfs.settings.market;
      const englishLang = require('./languages/en-US.json');
      let check = 0;
      const array1 = [];
      // eslint-disable-next-line guard-for-in
      for (const i in userconfs.settings.inventory) {
        if (userconfs.settings.inventory[i] === 0) {
          check++;
        }
        if (userconfs.settings.inventory[i] !== 0) {
          const itemSettings = {
            emoji: marketconfs[i][0],
            amount: userconfs.settings.inventory[i],
            name: englishLang[`loot_${i}`]
          };
          array1.push(itemSettings);
        }
      }

      let socialmediaCheck = 0;
      for (const x in userconfs.settings.socialmedia) {
        if (userconfs.settings.socialmedia[x] === '') socialmediaCheck++;
      }

      const itemsnames = [];
      for (const x in marketitemskeys) {
        itemsnames.push(x);
      }

      let inventoryslotcheck = 0;
      for (let x = 0; x < itemsnames.length; x++) {
        inventoryslotcheck += parseInt(userconfs.settings.inventory[itemsnames[x]], 10);
      }


      const lang = require(`./languages/website_${req.getLocale()}`);
      const islenoxbot = islenoxboton(req);
      return res.render('profile', {
        languages: languages(req),
        lang,
        user: req.user,
        profileUser,
        userDescription: userconfs.settings.description.length === 0 ? null : userconfs.settings.description,
        badgesAndTitles,
        userCredits: rowCredits,
        // userCreditsGlobalRank: globalrank,
        inventoryItems: check === Object.keys(userconfs.settings.inventory).length ? null : array1,
        inventoryItemsUsed: inventoryslotcheck,
        inventoryItemsSpace: userconfs.settings.inventoryslots,
        userSocialmediaCheck: socialmediaCheck === Object.keys(userconfs.settings.socialmedia).length ? null : true,
        userSocialmediaTwitch: userconfs.settings.socialmedia.twitch === '' ? null : userconfs.settings.socialmedia.twitch,
        userSocialmediaYoutube: userconfs.settings.socialmedia.youtube === '' ? null : userconfs.settings.socialmedia.youtube,
        userSocialmediaTwitter: userconfs.settings.socialmedia.twitter === '' ? null : userconfs.settings.socialmedia.twitter,
        userSocialmediaInstagram: userconfs.settings.socialmedia.instagram === '' ? null : userconfs.settings.socialmedia.instagram,
        userSocialmediaFacebook: userconfs.settings.socialmedia.facebook === '' ? null : userconfs.settings.socialmedia.facebook,
        userSocialmediaGithub: userconfs.settings.socialmedia.github === '' ? null : userconfs.settings.socialmedia.github,
        userSocialmediaPinterest: userconfs.settings.socialmedia.pinterest === '' ? null : userconfs.settings.socialmedia.pinterest,
        userSocialmediaReddit: userconfs.settings.socialmedia.reddit === '' ? null : userconfs.settings.socialmedia.reddit,
        isstaff,
        ispremium,
        islenoxbot
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/team', async (req, res) => {
    try {
      const islenoxbot = islenoxboton(req);
      const team = [];
      const teamroles = ['administrator', 'developer', 'pr manager', 'moderator', 'test-moderator', 'designer', 'translation manager', 'translation proofreader'];

      let guild;
      await shardingManager.broadcastEval(`this.guilds.get("${settings.botMainDiscordServer}")`)
        .then((guildArray) => {
          guild = guildArray.find((g) => g);
        });
      if (!guild) return res.redirect('/servers');

      const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").members.array()`);
      guild.members = evaledMembers;

      const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").roles.array()`);
      guild.roles = evaledRoles;

      for (let i = 0; i < teamroles.length; i += 1) {
        const teamSettings = {};
        const role = guild.roles.find((r) => r.name.toLowerCase() === teamroles[i]);

        if (role) {
          const evaledMembersFromRole = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").roles.get("${role.id}").members.array()`);

          teamSettings.roleName = role.name;
          teamSettings.roleMembers = [];

          evaledMembersFromRole.forEach(async (member) => {
            const userconfs = await userSettingsCollection.findOne({
              userId: member.userID
            });
            const evaledUser = await shardingManager.shards.get(guild.shardID).eval(`
					(async () => {
						const user = await this.users.fetch("${member.userID}")
						if (user) return user;
					})();
				`);
            if (userconfs.settings.socialmedia) {
              let socialmediaCheck = 0;
              for (const x in userconfs.settings.socialmedia) {
                if (userconfs.settings.socialmedia[x] === '') socialmediaCheck++;
              }

              if (socialmediaCheck !== Object.keys(userconfs.settings.socialmedia).length) {
                evaledUser.socialmedia = {};
                for (const index in userconfs.settings.socialmedia) {
                  if (userconfs.settings.socialmedia[index] !== '') {
                    evaledUser.socialmedia[index] = userconfs.settings.socialmedia[index];
                  }
                }
              }
            }

            teamSettings.roleMembers.push(evaledUser);
          });
          team.push(teamSettings);
        }
      }

      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('team', {
        languages: languages(req),
        lang,
        user: req.user,
        team,
        islenoxbot
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/commands', async (req, res) => {
    try {
      const commandlist = await botSettingsCollection.findOne({
        botconfs: 'botconfs'
      });
      const newcommandlist = [];
      const lenoxbotLang = require(`./languages/${req.getLocale()}`);
      // eslint-disable-next-line guard-for-in
      for (const key in commandlist.settings.commands) {
        commandlist.settings.commands[key].usage = `?${commandlist.settings.commands[key].usage}`;
        commandlist.settings.commands[key].description = lenoxbotLang[`${commandlist.settings.commands[key].name}_description`];
        newcommandlist.push(commandlist.settings.commands[key]);
      }

      let isstaff = false;
      if (req.user) {
        const teamroles = ['administrator', 'developer', 'moderator', 'test-moderator', 'designer', 'translation manager', 'translation proofreader', 'pr manager'];

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${settings.botMainDiscordServer}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${settings.botMainDiscordServer}").channels.array()`);
        guild.channels = evaledChannels;

        for (let i = 0; i < teamroles.length; i += 1) {
          const roleMembers = await shardingManager.shards.get(guild.shardID).eval(`
					(() => {
						const roleFound = this.guilds.get("${settings.botMainDiscordServer}").roles.find(r => r.name.toLowerCase() === "${teamroles[i]}");
						if (roleFound) {
							const roleMembers = roleFound.members.array();
							return roleMembers;
						}
					})();
        `);
          if (roleMembers) {
            roleMembers.forEach((member) => {
              if (member.userID === req.user.id) {
                isstaff = true;
              }
            });
          }
        }
      }

      const islenoxbot = islenoxboton(req);

      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('commands', {
        languages: languages(req),
        lang,
        user: req.user,
        islenoxbot,
        commands: newcommandlist,
        isstaff
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/donate', (req, res) => {
    try {
      const check = [];
      if (req.user) {
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (((req.user.guilds[i].permissions) & 8) === 8) {
            check.push(req.user.guilds[i]);
          }
        }
      }
      const islenoxbot = islenoxboton(req);
      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('donate', {
        languages: languages(req),
        lang,
        user: req.user,
        guilds: check,
        islenoxbot
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/donationsuccess', (req, res) => {
    try {
      const islenoxbot = islenoxboton(req);
      const lang = require(`./languages/website_${req.getLocale()}`);
      return res.render('donationsuccess', {
        languages: languages(req),
        lang,
        user: req.user,
        islenoxbot
      });
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/documentation', (req, res) => res.redirect('https://docs.lenoxbot.com'));

  app.get('/servers', async (req, res) => {
    try {
      if (req.user) {
        const check = [];

        for (let i = 0; i < req.user.guilds.length; i += 1) {
          const dashboardid = req.user.guilds[i].id;
          const guildconfs = await guildSettingsCollection.findOne({
            guildId: dashboardid
          });

          let guild;
          await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
            .then((guildArray) => {
              guild = guildArray.find((g) => g);
            });

          let evaledMembers;
          if (guild) {
            evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
            guild.members = evaledMembers;
          }


          if (guildconfs && guild) {
            if (!guildconfs.settings.dashboardpermissionroles) {
              guildconfs.settings.dashboardpermissionroles = [];
              await guildSettingsCollection.updateOne({
                guildId: dashboardid
              }, {
                $set: {
                  settings: guildconfs.settings
                }
              });
            }

            if (guildconfs.settings.dashboardpermissionroles.length !== 0 && guild.ownerID !== req.user.id) {
              let allwhitelistedrolesoftheuser = 0;

              for (let index2 = 0; index2 < guildconfs.settings.dashboardpermissionroles.length; index2++) {
                if (!guild.members.find((r) => r.userID === req.user.id)) return res.redirect('/servers');
                if (!guild.members.find((r) => r.userID === req.user.id).roles.includes(guildconfs.settings.dashboardpermissionroles[index2])) {
                  allwhitelistedrolesoftheuser += 1;
                }
              }
              if (allwhitelistedrolesoftheuser !== guildconfs.settings.dashboardpermissionroles.length) {
                req.user.guilds[i].lenoxbot = !!guild;

                if (req.user.guilds[i].lenoxbot === true) {
                  req.user.guilds[i].memberscount = guild.memberCount;
                }

                if (guildconfs.settings) {
                  if (guildconfs.settings.premium && guildconfs.settings.premium.status === true) {
                    req.user.guilds[i].premium = true;
                  }
                  else {
                    req.user.guilds[i].premium = false;
                  }
                }
                else {
                  req.user.guilds[i].premium = false;
                }

                check.push(req.user.guilds[i]);
              }
            }
            else if (((req.user.guilds[i].permissions) & 8) === 8) {
              req.user.guilds[i].lenoxbot = !!guild;

              if (req.user.guilds[i].lenoxbot === true) {
                req.user.guilds[i].memberscount = guild.memberCount;
              }

              if (guildconfs.settings) {
                if (guildconfs.settings.premium && guildconfs.settings.premium.status === true) {
                  req.user.guilds[i].premium = true;
                }
                else {
                  req.user.guilds[i].premium = false;
                }
              }
              else {
                req.user.guilds[i].premium = false;
              }

              check.push(req.user.guilds[i]);
            }
          }
          else if (((req.user.guilds[i].permissions) & 8) === 8) {
            req.user.guilds[i].lenoxbot = !!guild;

            if (req.user.guilds[i].lenoxbot === true) {
              req.user.guilds[i].memberscount = guild.memberCount;
            }

            if (guildconfs && guildconfs.settings) {
              if (guildconfs.settings.premium && guildconfs.settings.premium.status === true) {
                req.user.guilds[i].premium = true;
              }
              else {
                req.user.guilds[i].premium = false;
              }
            }
            else {
              req.user.guilds[i].premium = false;
            }

            check.push(req.user.guilds[i]);
          }

          check.sort((a, b) => {
            if (a.lenoxbot < b.lenoxbot) {
              return 1;
            }
            if (a.lenoxbot > b.lenoxbot) {
              return -1;
            }
            return 0;
          });
        }
        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('servers', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot
        });
      }
      return res.redirect('nologin');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/tickets/:ticketid/submitticketanswer', async (req, res) => {
    try {
      if (req.user) {
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        if (botconfs.settings.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');
        if (botconfs.settings.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../error');

        const ticket = botconfs.settings.tickets[req.params.ticketid];

        const length = Object.keys(ticket.answers).length + 1;

        req.body.newticketanswer = req.body.newticketanswer.replace(/(?:\r\n|\r|\n)/g, '<br>');

        ticket.answers[length] = {
          authorid: req.user.id,
          guildid: ticket.guildid,
          date: Date.now(),
          content: req.body.newticketanswer,
          timelineconf: ''
        };

        await botSettingsCollection.updateOne({
          botconfs: 'botconfs'
        }, {
          $set: {
            settings: botconfs.settings
          }
        });
        await reloadBotSettings();

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: ticket.guildid
        });

        if (guildconfs && guildconfs.settings.tickets.status === true) {
          const lang = require(`./languages/${guildconfs.settings.language}.json`);

          const ticketembedanswer = lang.mainfile_ticketembedanswer.replace('%ticketid', ticket.ticketid);
          const embed = new Discord.MessageEmbed()
            .setURL(`https://lenoxbot.com/dashboard/${ticket.guildid}/tickets/${ticket.ticketid}/overview`)
            .setTimestamp()
            .setColor('#ccffff')
            .setTitle(lang.mainfile_ticketembedtitle)
            .setDescription(ticketembedanswer);

          let guild;
          shardingManager.broadcastEval(`this.guilds.get("${ticket.guildid}")`)
            .then((guildArray) => {
              guild = guildArray.find((g) => g);
            });

          try {
            if (guild) {
              await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedChannel = await this.channels.get("${guildconfs.settings.tickets.notificationchannel}");
		if (fetchedChannel) {
			await fetchedChannel.send({ embed: ${JSON.stringify(embed)} });
			return fetchedChannel;
		}
    })();
`);
            }
          }
          catch (error) {
            'undefined';
          }
        }

        return res.redirect(url.format({
          pathname: `/tickets/${ticket.ticketid}/overview`,
          query: {
            submitticketanswer: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/tickets/:ticketid/submitnewticketstatus', async (req, res) => {
    try {
      if (req.user) {
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });
        if (botconfs.settings.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');
        if (botconfs.settings.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../error');
        if (botconfs.settings.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

        const ticket = botconfs.settings.tickets[req.params.ticketid];

        if (ticket.status === req.body.newstatus) return res.redirect(`/tickets/${ticket.ticketid}/overview`);

        ticket.status = req.body.newstatus;

        const length = Object.keys(ticket.answers).length + 1;

        if (ticket.status === 'closed') {
          ticket.answers[length] = {
            authorid: req.user.id,
            guildid: req.params.id,
            date: Date.now(),
            content: 'closed the ticket!',
            timelineconf: '',
            toStatus: 'closed'
          };
        }
        else if (ticket.status === 'open') {
          ticket.answers[length] = {
            authorid: req.user.id,
            guildid: req.params.id,
            date: Date.now(),
            content: 'opened the ticket!',
            timelineconf: '',
            toStatus: 'open'
          };
        }

        await botSettingsCollection.updateOne({
          botconfs: 'botconfs'
        }, {
          $set: {
            settings: botconfs.settings
          }
        });
        await reloadBotSettings();

        return res.redirect(url.format({
          pathname: `/tickets/${ticket.ticketid}/overview`,
          query: {
            submitnewticketstatus: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/tickets/:ticketid/overview', async (req, res) => {
    try {
      if (req.user) {
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });
        if (botconfs.settings.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');
        if (botconfs.settings.tickets[req.params.ticketid].authorid !== req.user.id) return res.redirect('../error');

        const ticket = botconfs.settings.tickets[req.params.ticketid];

        botconfs.settings.tickets[req.params.ticketid].newdate = moment(botconfs.settings.tickets[req.params.ticketid].date).format('MMMM Do YYYY, h:mm:ss a');

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${ticket.guildid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });

        const author = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${botconfs.settings.tickets[req.params.ticketid].authorid}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);
        botconfs.settings.tickets[req.params.ticketid].author = author.tag;

        for (const index in ticket.answers) {
          const author2 = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${ticket.answers[index].authorid}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);
          ticket.answers[index].author = author2 ? author2.tag : ticket.answers[index].authorid;
          ticket.answers[index].newdate = moment(ticket.answers[index].date).format('MMMM Do YYYY, h:mm:ss a');
        }
        const islenoxbot = islenoxboton(req);

        const sortableAnswers = [];
        for (const key in botconfs.settings.tickets[req.params.ticketid].answers) {
          sortableAnswers.push(botconfs.settings.tickets[req.params.ticketid].answers[key]);
        }

        let answers;
        if (Object.keys(botconfs.settings.tickets[req.params.ticketid].answers).length === 0) {
          answers = false;
        }
        else {
          const answersOnTicket = sortableAnswers;
          answers = answersOnTicket.sort((a, b) => {
            if (a.date < b.date) {
              return 1;
            }
            if (a.date > b.date) {
              return -1;
            }
            return 0;
          });
        }
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('ticket', {
          languages: languages(req),
          lang,
          user: req.user,
          islenoxbot,
          ticket,
          answers,
          status: botconfs.settings.tickets[req.params.ticketid].status === 'open'
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  // ADMIN PANEL:
  app.get('/dashboard/:id/overview', async (req, res) => {
    let guildconfs;
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildsettingskeys = require('./guildsettings-keys.json');
        guildsettingskeys.prefix = settings.prefix;

        /* if (guildconfs) {
					for (const key in guildsettingskeys) {
						if (!guildconfs.settings[key]) {
							guildconfs.settings[key] = guildsettingskeys[key];
						}
					}

					for (let i = 0; i < client.commands.array().length; i += 1) {
						if (!tableload.commands[client.commands.array()[i].help.name]) {
							tableload.commands[client.commands.array()[i].help.name] = {
								name: client.commands.array()[i].help.name,
								status: 'true',
								bannedroles: [],
								bannedchannels: [],
								cooldown: '3000',
								ifBlacklistForRoles: 'true',
								ifBlacklistForChannels: 'true',
								whitelistedroles: [],
								whitelistedchannels: []
							};
						}
						if (!tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles) {
							tableload.commands[client.commands.array()[i].help.name].ifBlacklistForRoles = 'true';
							tableload.commands[client.commands.array()[i].help.name].ifBlacklistForChannels = 'true';
							tableload.commands[client.commands.array()[i].help.name].whitelistedroles = [];
							tableload.commands[client.commands.array()[i].help.name].whitelistedchannels = [];
						}
					}

					await guildSettingsCollection.updateOne({ guildId: dashboardid }, { $set: { settings: guildconfs.settings } });;
				} else {
					for (let i = 0; i < client.commands.array().length; i += 1) {
						if (!guildsettingskeys.commands[client.commands.array()[i].help.name]) {
							guildsettingskeys.commands[client.commands.array()[i].help.name] = {
								name: client.commands.array()[i].help.name,
								status: 'true',
								bannedroles: [],
								bannedchannels: [],
								cooldown: '3000',
								ifBlacklistForRoles: 'true',
								ifBlacklistForChannels: 'true',
								whitelistedroles: [],
								whitelistedchannels: []
							};
						}
						if (!guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForRoles) {
							guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForRoles = 'true';
							guildsettingskeys.commands[client.commands.array()[i].help.name].ifBlacklistForChannels = 'true';
							guildsettingskeys.commands[client.commands.array()[i].help.name].whitelistedroles = [];
							guildsettingskeys.commands[client.commands.array()[i].help.name].whitelistedchannels = [];
						}
					}

					client.guildconfs.set(dashboardid, guildsettingskeys);
				}
				*/

        guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        let check;
        let logs;
        shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then(async (guildArray) => {
            guild = guildArray.find((g) => g);
            if (!guild) return undefined;

            const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
            guild.members = evaledMembers;

            if (guildconfs.settings.dashboardpermissionroles.length !== 0 && guild.ownerID !== req.user.id) {
              let allwhitelistedrolesoftheuser = 0;

              for (let index2 = 0; index2 < guildconfs.settings.dashboardpermissionroles.length; index2++) {
                if (!guild.members.find((r) => r.userID === req.user.id)) return res.redirect('/servers');
                if (!guild.members.find((r) => r.userID === req.user.id).roles.includes(guildconfs.settings.dashboardpermissionroles[index2])) {
                  allwhitelistedrolesoftheuser += 1;
                }
              }
              if (allwhitelistedrolesoftheuser === guildconfs.settings.dashboardpermissionroles.length) {
                return res.redirect('/servers');
              }
            }
            else if (((req.user.guilds[index].permissions) & 8) !== 8) {
              return res.redirect('/servers');
            }

            if (!guild) return res.redirect('/servers');

            req.user.guilds[index].memberscount = guild.memberCount;
            req.user.guilds[index].memberscountincrement = Math.floor(guild.memberCount / 170) + 1;
            req.user.guilds[index].channelscount = guild.channels.length;
            req.user.guilds[index].channelscountincrement = Math.floor(guild.channels.length / 170) + 1;
            req.user.guilds[index].rolescount = guild.roles.length;
            req.user.guilds[index].rolescountincrement = Math.floor(guild.roles.length / 170) + 1;
            req.user.guilds[index].lenoxbotjoined = guild.members.find((r) => r.userID === '354712333853130752') ? moment(guild.members.find((r) => r.userID === '354712333853130752').joinedAt).format('MMMM Do YYYY, h:mm:ss a') : 'Undefined';
            req.user.guilds[index].prefix = guildconfs.settings.prefix;

            check = req.user.guilds[index];

            const lang = require(`./languages/website_${req.getLocale()}`);
            if (guildconfs.settings.globallogs) {
              guildconfs.settings.globallogs.forEach((log) => {
                if (log.action.split(' ').length === 1) {
                  let newAction = lang[`website_globalmodlog_${log.action}`];

                  if (log.variable) {
                    newAction = newAction.replace('%variable', log.variable);
                  }
                  log.action = newAction;
                }
                if (log.executed) {
                  log.executed = lang[`website_globalmodlog_executed_${log.executed}`];
                }
                else {
                  log.executed = lang.website_global_undefined;
                }
              });

              const thelogs = guildconfs.settings.globallogs;
              logs = thelogs.sort((a, b) => {
                if (a.date < b.date) {
                  return 1;
                }
                if (a.date > b.date) {
                  return -1;
                }
                return 0;
              }).slice(0, 15);
            }
            else {
              logs = null;
            }

            const islenoxbot = islenoxboton(req);
            return res.render('dashboard/overview', {
              languages: languages(req),
              lang,
              user: req.user,
              guilds: check,
              islenoxbot,
              logs
            });
          });
      }
      else {
        return res.redirect('/loginpressedbutton');
      }
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitlogs', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        permissionsCheck(guildconfs, guild, req, res, index);

        if (req.body[Object.keys(req.body)[0]] === 'false') {
          guildconfs.settings[Object.keys(req.body)[0]] = 'false';
        }
        else {
          guildconfs.settings[Object.keys(req.body)[0]] = 'true';
          guildconfs.settings[`${[Object.keys(req.body)[0]]}channel`] = guild.channels.find((c) => c.name === `${req.body[Object.keys(req.body)[0]]}`).id;
        }

        guildconfs.settings.globallogs.push({
          action: 'updatedlog',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: Object.keys(req.body)[0]
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitselfassignableroles', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        if (req.body.newselfassignableroles) {
          const { newselfassignableroles } = req.body;
          const array = [];

          if (Array.isArray(newselfassignableroles)) {
            for (let i = 0; i < newselfassignableroles.length; i += 1) {
              array.push(newselfassignableroles[i]);
            }
            guildconfs.settings.selfassignableroles = array;
          }
          else {
            array.push(newselfassignableroles);
            guildconfs.settings.selfassignableroles = array;
          }
        }
        else {
          guildconfs.settings.selfassignableroles = [];
        }

        guildconfs.settings.globallogs.push({
          action: 'selfassignableroles',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submittogglexp', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newxpchannels } = req.body;
        const array = [];

        if (Array.isArray(newxpchannels)) {
          for (let i = 0; i < newxpchannels.length; i += 1) {
            array.push(guild.channels.find((c) => c.name === newxpchannels[i]).id);
          }
          guildconfs.settings.togglexp.channelids = array;
        }
        else {
          array.push(guild.channels.find((c) => c.name === newxpchannels).id);
          guildconfs.settings.togglexp.channelids = array;
        }

        guildconfs.settings.globallogs.push({
          action: 'togglexpchannels',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitbyemsg', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newbyemsg } = req.body;

        guildconfs.settings.byemsg = newbyemsg;

        guildconfs.settings.globallogs.push({
          action: 'goodbyemessage',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitwelcomemsg', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newwelcomemsg } = req.body;

        guildconfs.settings.welcomemsg = newwelcomemsg;

        guildconfs.settings.globallogs.push({
          action: 'welcomemessage',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitprefix', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newprefix } = req.body;

        guildconfs.settings.prefix = newprefix;

        guildconfs.settings.globallogs.push({
          action: 'prefix',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
        if (this.guilds.get("${dashboardid}")) {
        const x = await this.provider.reloadGuild("${dashboardid}", "prefix", "${newprefix}");
        return x;
        }
    })();
`);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitlanguage', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const newlanguage = JSON.parse(req.body.newlanguage);

        guildconfs.settings.language = newlanguage.alias;
        guildconfs.settings.momentLanguage = newlanguage.momentLanguage;

        guildconfs.settings.globallogs.push({
          action: 'language',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/modules`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitcommanddeletion', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newcommanddeletion } = req.body;

        guildconfs.settings.commanddel = newcommanddeletion;

        guildconfs.settings.globallogs.push({
          action: 'commanddeletion',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitmuterole', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newmuterole } = req.body;

        guildconfs.settings.muterole = newmuterole;

        guildconfs.settings.globallogs.push({
          action: 'muterole',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submittogglechatfilter', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newchatfilter } = req.body;

        guildconfs.settings.chatfilter.chatfilter = newchatfilter;

        guildconfs.settings.globallogs.push({
          action: 'togglechatfilter',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submittogglexpmessages', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newxpmessages } = req.body;

        guildconfs.settings.xpmessages = newxpmessages;

        guildconfs.settings.globallogs.push({
          action: 'togglexpmessages',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitchatfilterarray', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      let index;
      if (req.user) {
        index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const newchatfilterarray = req.body.newchatfilterarray.replace(/\s/g, '').split(',');

        for (let i = 0; i < newchatfilterarray.length; i += 1) {
          for (let index3 = 0; index3 < newchatfilterarray.length; index3++) {
            if (newchatfilterarray[i].toLowerCase() === newchatfilterarray[index3].toLowerCase() && i !== index3) {
              newchatfilterarray.splice(index3, 1);
            }
          }
        }

        guildconfs.settings.chatfilter.array = newchatfilterarray;

        guildconfs.settings.globallogs.push({
          action: 'chatfilterentries',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submittogglewelcome', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newwelcome } = req.body;

        if (newwelcome === 'false') {
          guildconfs.settings.welcome = 'false';
        }
        else {
          guildconfs.settings.welcome = 'true';
          guildconfs.settings.welcomechannel = newwelcome;
        }

        guildconfs.settings.globallogs.push({
          action: 'togglewelcomemessage',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submittogglebye', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newbye } = req.body;

        if (newbye === 'false') {
          guildconfs.settings.bye = 'false';
        }
        else {
          guildconfs.settings.bye = 'true';
          guildconfs.settings.byechannel = newbye;
        }

        guildconfs.settings.globallogs.push({
          action: 'togglegoodbyemessage',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submittoggleannounce', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newannounce } = req.body;

        if (newannounce === 'false') {
          guildconfs.settings.announce = 'false';
          guildconfs.settings.announcechannel = '';
        }
        else {
          guildconfs.settings.announce = 'true';
          guildconfs.settings.announcechannel = newannounce;
        }

        guildconfs.settings.globallogs.push({
          action: 'announcementsettings',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitpermissionsticket', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        guildconfs.settings.dashboardticketpermissions = Number(req.body.newpermissionticket);

        guildconfs.settings.globallogs.push({
          action: 'permissionstickets',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitpermissionsapplication', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        guildconfs.settings.dashboardapplicationpermissions = Number(req.body.newpermissionapplication);

        guildconfs.settings.globallogs.push({
          action: 'permissionsapplication',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/administration/submitpermissionsdashboard', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        if (!guildconfs.settings.dashboardpermissionroles) {
          guildconfs.settings.dashboardpermissionroles = [];
        }

        if (req.body.newpermissiondashboard) {
          const { newpermissiondashboard } = req.body;
          const array = [];

          if (Array.isArray(newpermissiondashboard)) {
            for (let i = 0; i < newpermissiondashboard.length; i += 1) {
              array.push(newpermissiondashboard[i]);
            }
            guildconfs.settings.dashboardpermissionroles = array;
          }
          else {
            array.push(newpermissiondashboard);
            guildconfs.settings.dashboardpermissionroles = array;
          }
        }
        else {
          guildconfs.settings.dashboardpermissionroles = [];
        }

        guildconfs.settings.globallogs.push({
          action: 'permissionsdashboard',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/administration`,
          query: {
            submitadministration: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/administration', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        req.user.guilds[index].prefix = guildconfs.settings.prefix;

        req.user.guilds[index].welcomemsg = guildconfs.settings.welcomemsg;
        req.user.guilds[index].byemsg = guildconfs.settings.byemsg;

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');

        if (guildconfs.settings.togglexp) {
          for (let i = 0; i < channels.length; i += 1) {
            if (guildconfs.settings.togglexp.channelids.includes(channels[i].id)) {
              channels[i].togglexpset = true;
            }
            if (guildconfs.settings.welcomechannel === channels[i].id) {
              channels[i].welcomeset = true;
            }
            if (guildconfs.settings.byechannel === channels[i].id) {
              channels[i].byeset = true;
            }
            if (guildconfs.settings.announcechannel === channels[i].id) {
              channels[i].announceset = true;
            }
          }
        }
        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const check = req.user.guilds[index];
        for (let index2 = 0; index2 < roles.length; index2++) {
          if (guildconfs.settings.selfassignableroles.includes(roles[index2].id)) {
            roles[index2].selfassignablerolesset = true;
          }
          if (guildconfs.settings.muterole === roles[index2].id) {
            roles[index2].muteroleset = true;
          }
          if (guildconfs.settings.dashboardpermissionroles.includes(roles[index2].id)) {
            roles[index2].dashboardpermissionset = true;
          }
        }

        const commands = botconfs.settings.commands.filter((r) => r.category === 'administration' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }
          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const languagesList = [{
          name: 'english',
          alias: 'en-US',
          momentLanguage: 'en'
        },
        {
          name: 'german',
          alias: 'de-DE',
          momentLanguage: 'de'
        },
        {
          name: 'french',
          alias: 'fr-FR',
          momentLanguage: 'fr'
        },
        {
          name: 'spanish',
          alias: 'es-ES',
          momentLanguage: 'es'
        },
        {
          name: 'swiss',
          alias: 'de-CH',
          momentLanguage: 'de-CH'
        },
        {
          name: 'turkish',
          alias: 'tr-TR',
          momentLanguage: 'tr-TR'
        }];

        if (guildconfs.settings.language) {
          for (let index3 = 0; index3 < languagesList.length; index3++) {
            if (guildconfs.settings.language === languagesList[index3].alias) {
              languagesList[index3].set = true;
            }
          }
        }

        const confs = {};
        if (guildconfs.settings) {
          for (let i = 0; i < channels.length; i += 1) {
            if (channels[i].id === guildconfs.settings.modlogchannel) {
              if (guildconfs.settings.modlog === 'true') {
                channels[i].modlogset = true;
                confs.modlogset = true;
              }
              else {
                confs.modlogdeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.chatfilterlogchannel) {
              if (guildconfs.settings.chatfilterlog === 'true') {
                channels[i].chatfilterset = true;
                confs.chatfilterset = true;
              }
              else {
                confs.chatfilterdeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.messagedeletelogchannel) {
              if (guildconfs.settings.messagedeletelog === 'true') {
                channels[i].messagedeleteset = true;
                confs.messagedeleteset = true;
              }
              else {
                confs.messagedeletedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.messageupdatelogchannel) {
              if (guildconfs.settings.messageupdatelog === 'true') {
                channels[i].messageupdateset = true;
                confs.messageupdateset = true;
              }
              else {
                confs.messageupdatedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.channelupdatelogchannel) {
              if (guildconfs.settings.channelupdatelog === 'true') {
                channels[i].channelupdateset = true;
                confs.channelupdateset = true;
              }
              else {
                confs.channelupdatedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.channelcreatelogchannel) {
              if (guildconfs.settings.channeldeletelog === 'true') {
                channels[i].channelcreateset = true;
                confs.channelcreateset = true;
              }
              else {
                confs.channelcreatedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.channeldeletelogchannel) {
              if (guildconfs.settings.channeldeletelog === 'true') {
                channels[i].channeldeleteset = true;
                confs.channeldeleteset = true;
              }
              else {
                confs.channeldeletedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.memberupdatelogchannel) {
              if (guildconfs.settings.memberupdatelog === 'true') {
                channels[i].memberupdateset = true;
                confs.memberupdateset = true;
              }
              else {
                confs.memberupdatedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.presenceupdatelogchannel) {
              if (guildconfs.settings.presenceupdatelog === 'true') {
                channels[i].presenceupdateset = true;
                confs.presenceupdateset = true;
              }
              else {
                confs.presenceupdatedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.welcomelogchannel) {
              if (guildconfs.settings.welcomelog === 'true') {
                channels[i].welcomeset = true;
                confs.welcomeset = true;
              }
              else {
                confs.welcomelogdeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.byelogchannel) {
              if (guildconfs.settings.byelog === 'true') {
                channels[i].byeset = true;
                confs.byeset = true;
              }
              else {
                confs.byelogdeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.rolecreatelogchannel) {
              if (guildconfs.settings.rolecreatelog === 'true') {
                channels[i].rolecreateset = true;
                confs.rolecreateset = true;
              }
              else {
                confs.rolecreatedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.roledeletelogchannel) {
              if (guildconfs.settings.roledeletelog === 'true') {
                channels[i].roledeleteset = true;
                confs.roledeleteset = true;
              }
              else {
                confs.roledeletedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.roleupdatelogchannel) {
              if (guildconfs.settings.roleupdatelog === 'true') {
                channels[i].roleupdateset = true;
                confs.roleupdateset = true;
              }
              else {
                confs.roleupdatedeactivated = true;
              }
            }

            if (channels[i].id === guildconfs.settings.guildupdatelogchannel) {
              if (guildconfs.settings.guildupdatelog === 'true') {
                channels[i].guildupdateset = true;
                confs.guildupdateset = true;
              }
              else {
                confs.guildupdatedeactivated = true;
              }
            }
          }
        }

        const permissions = {
          administrator: {
            name: 'Administrator',
            number: 8
          },
          kickmembersbanmembers: {
            name: 'Kick Members & Ban Members (Standard)',
            number: 6
          },
          manageserver: {
            name: 'Manage Server',
            number: 32
          },
          managemessages: {
            name: 'Manage Messages',
            number: 8192
          }
        };

        // eslint-disable-next-line guard-for-in
        for (const x in permissions) {
          if (guildconfs.settings.dashboardticketpermissions === permissions[x].number) {
            permissions[x].ticketpermissionset = true;
          }
          if (guildconfs.settings.dashboardapplicationpermissions === permissions[x].number) {
            permissions[x].applicationpermissionset = true;
          }
        }
        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/administration', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          channels,
          islenoxbot,
          roles,
          confs,
          announcedeactivated: guildconfs.settings.announce !== 'true',
          muteroledeactivated: guildconfs.settings.muterole === '',
          commanddeletionset: guildconfs.settings.commanddel === 'true',
          chatfilterset: guildconfs.settings.chatfilter.chatfilter === 'true',
          xpmesssagesset: guildconfs.settings.xpmessages === 'true',
          languagesList,
          chatfilterarray: guildconfs.settings.chatfilter ? guildconfs.settings.chatfilter.array.join(',') : '',
          commands,
          permissions,
          submitadministration: !!req.query.submitadministration
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/moderation/submittempbananonymous', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        if (!guildconfs.settings.muteanonymous) {
          guildconfs.settings.muteanonymous = 'false';
          await guildSettingsCollection.updateOne({
            guildId: dashboardid
          }, {
            $set: {
              settings: guildconfs.settings
            }
          });
        }

        if (!guildconfs.settings.tempbananonymous) {
          guildconfs.settings.tempbananonymous = 'false';
          await guildSettingsCollection.updateOne({
            guildId: dashboardid
          }, {
            $set: {
              settings: guildconfs.settings
            }
          });
        }

        guildconfs.settings.tempbananonymous = req.body.newtempbananonymous;

        guildconfs.settings.globallogs.push({
          action: 'anonymoustempban',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/moderation`,
          query: {
            submitmoderation: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/moderation/submitmuteanonymous', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        if (!guildconfs.settings.muteanonymous) {
          guildconfs.settings.muteanonymous = 'false';
          await guildSettingsCollection.updateOne({
            guildId: dashboardid
          }, {
            $set: {
              settings: guildconfs.settings
            }
          });
        }

        if (!guildconfs.settings.tempbananonymous) {
          guildconfs.settings.tempbananonymous = 'false';
          await guildSettingsCollection.updateOne({
            guildId: dashboardid
          }, {
            $set: {
              settings: guildconfs.settings
            }
          });
        }

        guildconfs.settings.muteanonymous = req.body.newmuteanonymous;

        guildconfs.settings.globallogs.push({
          action: 'anonymousmute',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/moderation`,
          query: {
            submitmoderation: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/moderation', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'moderation' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        if (!guildconfs.settings.muteanonymous) {
          guildconfs.settings.muteanonymous = 'false';
          await guildSettingsCollection.updateOne({
            guildId: dashboardid
          }, {
            $set: {
              settings: guildconfs.settings
            }
          });
        }

        if (!guildconfs.settings.tempbananonymous) {
          guildconfs.settings.tempbananonymous = 'false';
          await guildSettingsCollection.updateOne({
            guildId: dashboardid
          }, {
            $set: {
              settings: guildconfs.settings
            }
          });
        }

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/moderation', {
          languages: languages(req),
          lang,
          user: req.user,
          muteanonymous: guildconfs.settings.muteanonymous === 'true',
          tempbananonymous: guildconfs.settings.tempbananonymous === 'true',
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submitmoderation: !!req.query.submitmoderation
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/help', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = [];
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'help' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/help', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submithelp: !!req.query.submithelp
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/music/submitchannelblacklist', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newchannelblacklist } = req.body;
        const array = [];

        if (Array.isArray(newchannelblacklist)) {
          for (let i = 0; i < newchannelblacklist.length; i += 1) {
            array.push(guild.channels.find((c) => c.name === newchannelblacklist[i]).id);
          }
          guildconfs.settings.musicchannelblacklist = array;
        }
        else {
          array.push(guild.channels.find((c) => c.name === newchannelblacklist).id);
          guildconfs.settings.musicchannelblacklist = array;
        }

        guildconfs.settings.globallogs.push({
          action: 'blacklistmusicchannels',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/music`,
          query: {
            submitmusic: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  /* app.post('/dashboard/:id/music/submitnewmusicaction', async (req, res) => {
		try {
			const dashboardid = req.params.id;
			if (req.user) {
				let index = -1;
				for (let i = 0; i < req.user.guilds.length; i += 1) {
					if (req.user.guilds[i].id === dashboardid) {
						index = i;
					}
				}

				if (index === -1) return res.redirect('/servers');

				if (client.guildconfs.get(dashboardid).dashboardpermissionroles.length !== 0 && client.guilds.get(dashboardid).ownerID !== req.user.id) {
					let allwhitelistedrolesoftheuser = 0;

					for (let index2 = 0; index2 < client.guildconfs.get(dashboardid).dashboardpermissionroles.length; index2++) {
						if (!client.guilds.get(dashboardid).members.get(req.user.id)) return res.redirect('/servers');
						if (!client.guilds.get(dashboardid).members.get(req.user.id).roles.has(client.guildconfs.get(dashboardid).dashboardpermissionroles[index2])) {
							allwhitelistedrolesoftheuser += 1;
						}
					}
					if (allwhitelistedrolesoftheuser === client.guildconfs.get(dashboardid).dashboardpermissionroles.length) {
						return res.redirect('/servers');
					}
				} else if (((req.user.guilds[index].permissions) & 8) !== 8) {
					return res.redirect('/servers');
				}

				if (!guild) return res.redirect('/servers');

				const serverQueue = client.queue.get(dashboardid);

				if (req.body.newmusicaction === 'play') {
					if (serverQueue.playing === true) {
						serverQueue.playing = false;
						serverQueue.connection.dispatcher.pause();
					} else {
						serverQueue.playing = true;
						serverQueue.connection.dispatcher.resume();
					}
				} else if (req.body.newmusicaction === 'stop') {
					serverQueue.songs = [];
					serverQueue.connection.dispatcher.end();
				} else {
					serverQueue.connection.dispatcher.end();
				}

				return res.redirect(url.format({
					pathname: `/dashboard/${dashboardid}/music`,
					query: {
						submitmusic: true
					}
				}));
			}
			return res.redirect('/loginpressedbutton');
		} catch (error) {
			return res.redirect(url.format({
				pathname: `/error`,
				query: {
					statuscode: 500,
					message: error.message
				}
			}));
		}
	}); */

  app.get('/dashboard/:id/music', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const voicechannels = guild.channels.filter((textChannel) => textChannel.type === 'voice');
        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        if (guildconfs.settings.musicchannelblacklist) {
          for (let i = 0; i < channels.length; i += 1) {
            if (guildconfs.settings.musicchannelblacklist.includes(channels[i].id)) {
              channels[i].channelblacklistset = true;
            }
          }
        }

        const commands = botconfs.settings.commands.filter((r) => r.category === 'music' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        // const guildQueue = await shardingManager.shards.get(guild.shardID).eval(`this.queue.get("${dashboardid}")`);

        const discordServerPlaylists = [];
        if (Object.keys(guildconfs.settings.playlist).length !== 0) {
          for (const index2 in guildconfs.settings.playlist) {
            const objectToPush = {};

            objectToPush.name = index2;
            objectToPush.howManyVideos = guildconfs.settings.playlist[index2].length;
            discordServerPlaylists.push(objectToPush);
          }
        }

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/music', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          voicechannels,
          roles,
          // musiccurrentlyplaying: guildQueue ? true : false,
          // song: guildQueue ? guildQueue.songs[0].title : false,
          discordServerPremium: guildconfs.settings.premium.status,
          discordServerPlaylists,
          commands,
          submitmusic: !!req.query.submitmusic
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/fun', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'fun' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/fun', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submitfun: !!req.query.submitfun
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/searches', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'searches' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/searches', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submitsearches: !!req.query.submitsearches
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/nsfw', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'nsfw' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/nsfw', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submitnsfw: !!req.query.submitnsfw
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/utility/submitsendembed', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        permissionsCheck(guildconfs, guild, req, res, index);

        const embed = new Discord.MessageEmbed();
        embed.setTitle(req.body.embedtitle);

        try {
          embed.setColor(req.body.embedcolor);
        }
        catch (error) {
          throw new Error('No color selected!');
        }

        if (req.body.embeddescription) {
          embed.setDescription(req.body.embeddescription);
        }

        if (req.body.embedlink) {
          embed.setURL(req.body.embedlink);
        }

        if (req.body.embedtimestamp) {
          embed.setTimestamp();
        }

        if (req.body.embedthumbnail) {
          embed.setThumbnail(req.body.embedthumbnail);
        }

        if (req.body.embedfooter) {
          embed.setFooter(req.body.embedfooter);
        }

        const embedchannel = guild.channels.find((r) => r.id === req.body.sendembedchannel);

        await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.get("${embedchannel.id}").send({embed: ${JSON.stringify(embed)}})`);

        guildconfs.settings.globallogs.push({
          action: 'sentembed',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: embedchannel.name
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/utility`,
          query: {
            submitutility: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/utility', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'utility' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/utility', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submitutility: !!req.query.submitutility
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/applications/:applicationid/submitdeleteapplication', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.dashboardapplicationpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardapplicationpermissions) !== guildconfs.settings.dashboardapplicationpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.application.applications[req.params.applicationid] === 'undefined') return res.redirect('../error');

        delete guildconfs.settings.application.applications[req.params.applicationid];

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/applications`,
          query: {
            submitdeleteapplication: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/applications/:applicationid/submitnewvote', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.dashboardapplicationpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardapplicationpermissions) !== guildconfs.settings.dashboardapplicationpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.application.applications[req.params.applicationid] === 'undefined') return res.redirect('../error');

        const application = guildconfs.settings.application.applications[req.params.applicationid];

        if (req.body.newvote === 'true' && !application.yes.includes(req.user.id) && !application.no.includes(req.user.id)) {
          application.yes.push(req.user.id);
        }
        else if (!application.no.includes(req.user.id) && !application.yes.includes(req.user.id)) {
          application.no.push(req.user.id);
        }

        try {
          if (application.yes.length >= guildconfs.settings.application.reactionnumber) {
            await shardingManager.broadcastEval(`
    (async () => {
		if (this.guilds.get("${dashboardid}")) {
		const user = await this.users.fetch("${application.authorid}");

		if (user) {
			user.send("${guildconfs.settings.application.acceptedmessage}")
		}

		const role = this.guilds.get("${dashboardid}").roles.get("${guildconfs.settings.application.role}");
		if (role) {
			await this.guilds.get("${dashboardid}").members.get("${application.authorid}").roles.add(role);
			return role
		}
	}
    })();
`);
            application.status = 'closed';
            application.acceptedorrejected = 'accepted';
          }
          else if (application.no.length >= guildconfs.settings.application.reactionnumber) {
            await shardingManager.broadcastEval(`
    (async () => {
		if (this.guilds.get("${dashboardid}")) {
		const user = await this.users.fetch("${application.authorid}");

		if (user) {
			user.send("${guildconfs.settings.application.rejectedmessage}");
		}

		const role = this.guilds.get("${dashboardid}").roles.get("${guildconfs.settings.application.denyrole}");
		if (role) {
			await this.guilds.get("${dashboardid}").members.get("${application.authorid}").roles.add(role);
			return role
		}
	}
    })();
`);
            application.status = 'closed';
            application.acceptedorrejected = 'rejected';
          }
        }
        catch (error) {
          'undefined';
        }

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/applications/${req.params.applicationid}/overview`,
          query: {
            submitnewticketstatus: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/applications/:applicationid/overview', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.dashboardapplicationpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardapplicationpermissions) !== guildconfs.settings.dashboardapplicationpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.application.applications[req.params.applicationid] === 'undefined') return res.redirect('../error');

        const check = req.user.guilds[index];

        const lang = require(`./languages/website_${req.getLocale()}`);
        // eslint-disable-next-line guard-for-in
        for (const index2 in guildconfs.settings.application.applications) {
          const author = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${guildconfs.settings.application.applications[index2].authorid}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);
          guildconfs.settings.application.applications[index2].author = author ? author.tag : guildconfs.settings.application.applications[index2].authorid;
          guildconfs.settings.application.applications[index2].newdate = moment(guildconfs.settings.application.applications[index2].date).format('MMMM Do YYYY, h:mm:ss a');
          guildconfs.settings.application.applications[index2].website_application_info = lang.website_application_info.replace('%author', author ? author.tag : guildconfs.settings.application.applications[index2].authorid).replace('%date', moment(guildconfs.settings.application.applications[index2].date).format('MMMM Do YYYY, h:mm:ss a'));
        }

        let votecheck = true;
        if (guildconfs.settings.application.applications[req.params.applicationid].yes.includes(req.user.id) || guildconfs.settings.application.applications[req.params.applicationid].no.includes(req.user.id)) {
          votecheck = false;
        }

        const islenoxbot = islenoxboton(req);

        return res.render('application', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          application: guildconfs.settings.application.applications[req.params.applicationid],
          yeslength: guildconfs.settings.application.applications[req.params.applicationid].yes.length,
          nolength: guildconfs.settings.application.applications[req.params.applicationid].no.length,
          status: guildconfs.settings.application.applications[req.params.applicationid].status === 'open',
          vote: votecheck
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/applications', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.dashboardapplicationpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardapplicationpermissions) !== guildconfs.settings.dashboardapplicationpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        const check = req.user.guilds[index];

        const newobject = {};
        const oldobject = {};

        // eslint-disable-next-line guard-for-in
        for (const index2 in guildconfs.settings.application.applications) {
          const author = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${guildconfs.settings.application.applications[index2].authorid}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);
          if (guildconfs.settings.application.applications[index2].guildid === dashboardid && guildconfs.settings.application.applications[index2].status === 'open') {
            newobject[index2] = guildconfs.settings.application.applications[index2];
            guildconfs.settings.application.applications[index2].author = author ? author.tag : guildconfs.settings.application.applications[index2].authorid;
            guildconfs.settings.application.applications[index2].newdate = moment(guildconfs.settings.application.applications[index2].date).format('MMMM Do YYYY, h:mm:ss a');
          }
          if (guildconfs.settings.application.applications[index2].guildid === dashboardid && guildconfs.settings.application.applications[index2].status === 'closed') {
            oldobject[index2] = guildconfs.settings.application.applications[index2];
            guildconfs.settings.application.applications[index2].author = author ? author.tag : guildconfs.settings.application.applications[index2].authorid;
            guildconfs.settings.application.applications[index2].newdate = moment(guildconfs.settings.application.applications[index2].date).format('MMMM Do YYYY, h:mm:ss a');
          }
        }

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/applications', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          applicationscheck: Object.keys(newobject).length !== 0,
          applications: newobject,
          oldapplicationscheck: Object.keys(oldobject).length !== 0,
          oldapplications: oldobject
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/application/submitnewacceptedmsg', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newacceptedmsg } = req.body;

        guildconfs.settings.application.acceptedmessage = newacceptedmsg;

        guildconfs.settings.globallogs.push({
          action: 'applicationacceptedmsg',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/application`,
          query: {
            submitapplication: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/application/submitnewrejectedmsg', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newrejectedmsg } = req.body;

        guildconfs.settings.application.rejectedmessage = newrejectedmsg;

        guildconfs.settings.globallogs.push({
          action: 'applicationrejectedmsg',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/application`,
          query: {
            submitapplication: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/application/submitdenyrole', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        if (req.body.newdenyrole === 'false') {
          guildconfs.settings.application.denyrole = '';
        }
        else {
          const { newdenyrole } = req.body;
          guildconfs.settings.application.denyrole = newdenyrole;
        }

        guildconfs.settings.globallogs.push({
          action: 'applicationrolerejected',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/application`,
          query: {
            submitapplication: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/application/submitrole', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        if (req.body.newrole === 'false') {
          guildconfs.settings.application.role = '';
        }
        else {
          const { newrole } = req.body;
          guildconfs.settings.application.role = newrole;
        }

        guildconfs.settings.globallogs.push({
          action: 'applicationroleaccepted',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/application`,
          query: {
            submitapplication: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/application/submitreactionnumber', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newreactionnumber } = req.body;

        guildconfs.settings.application.reactionnumber = newreactionnumber;

        guildconfs.settings.globallogs.push({
          action: 'reactionnumber',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/application`,
          query: {
            submitapplication: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/application/submitapplication', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const { newapplication } = req.body;

        guildconfs.settings.application.status = newapplication;

        guildconfs.settings.globallogs.push({
          action: 'toggleapplication',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/application`,
          query: {
            submitapplication: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/application', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        req.user.guilds[index].reactionnumber = guildconfs.settings.application.reactionnumber;
        req.user.guilds[index].acceptedmessage = guildconfs.settings.application.acceptedmessage;
        req.user.guilds[index].rejectedmessage = guildconfs.settings.application.rejectedmessage;

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        if (guildconfs.settings.application) {
          for (let i = 0; i < channels.length; i += 1) {
            if (guildconfs.settings.application.votechannel === channels[i].id) {
              channels[i].votechannelset = true;
            }
            if (guildconfs.settings.application.archivechannellog === channels[i].id) {
              channels[i].archivechannelset = true;
            }
          }
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');
        if (guildconfs.settings.application) {
          for (let i2 = 0; i2 < roles.length; i2++) {
            if (guildconfs.settings.application.role === roles[i2].id) {
              roles[i2].roleset = true;
            }
            if (guildconfs.settings.application.denyrole === roles[i2].id) {
              roles[i2].denyroleset = true;
            }
          }
        }

        const commands = botconfs.settings.commands.filter((r) => r.category === 'application' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/application', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submitapplication: !!req.query.submitapplication
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/currency', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'currency' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/currency', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          submitcurrency: !!req.query.submitcurrency
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/tickets/:ticketid/submitticketanswer', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.dashboardticketpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardticketpermissions) !== guildconfs.settings.dashboardticketpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        if (botconfs.settings.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

        const ticket = botconfs.settings.tickets[req.params.ticketid];

        const length = Object.keys(ticket.answers).length + 1;

        req.body.newticketanswer = req.body.newticketanswer.replace(/(?:\r\n|\r|\n)/g, '<br>');

        ticket.answers[length] = {
          authorid: req.user.id,
          guildid: req.params.id,
          date: Date.now(),
          content: req.body.newticketanswer,
          timelineconf: 'timeline-inverted'
        };

        await botSettingsCollection.updateOne({
          botconfs: 'botconfs'
        }, {
          $set: {
            settings: botconfs.settings
          }
        });
        await reloadBotSettings(guild);

        try {
          const lang = require(`./languages/${guildconfs.settings.language}.json`);
          const newanswer = lang.mainfile_newanswer.replace('%link', `https://lenoxbot.com/tickets/${ticket.ticketid}/overview`);
          await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${ticket.authorid}")
		if (fetchedUser) {
			await fetchedUser.send("${newanswer}")
			return fetchedUser;
		}
    })();
`);
        }
        catch (error) {
          'undefined';
        }

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`,
          query: {
            submitticketanswer: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/tickets/:ticketid/submitnewticketstatus', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.dashboardticketpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardticketpermissions) !== guildconfs.settings.dashboardticketpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        if (botconfs.settings.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

        const ticket = botconfs.settings.tickets[req.params.ticketid];

        if (ticket.status === req.body.newstatus) return res.redirect(`/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`);

        ticket.status = req.body.newstatus;

        const length = Object.keys(ticket.answers).length + 1;

        if (ticket.status === 'closed') {
          ticket.answers[length] = {
            authorid: req.user.id,
            date: Date.now(),
            content: 'closed the ticket!',
            timelineconf: 'timeline-inverted',
            toStatus: 'closed'
          };
        }
        else if (ticket.status === 'open') {
          ticket.answers[length] = {
            authorid: req.user.id,
            date: Date.now(),
            content: 'opened the ticket!',
            timelineconf: 'timeline-inverted',
            toStatus: 'open'
          };
        }

        await botSettingsCollection.updateOne({
          botconfs: 'botconfs'
        }, {
          $set: {
            settings: botconfs.settings
          }
        });
        await reloadBotSettings(guild);

        try {
          const lang = require(`./languages/${guildconfs.settings.language}.json`);
          const statuschange = lang.mainfile_statuschange.replace('%status', ticket.status).replace('%link', `https://lenoxbot.com/tickets/${ticket.ticketid}/overview`);
          await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${ticket.authorid}");
		if (fetchedUser) {
			await fetchedUser.send("${statuschange}")
			return fetchedUser;
		}
    })();
`);
        }
        catch (error) {
          'undefined';
        }

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/tickets/${ticket.ticketid}/overview`,
          query: {
            submitnewticketstatus: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/tickets/:ticketid/overview', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        if (guildconfs.settings.dashboardticketpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardticketpermissions) !== guildconfs.settings.dashboardticketpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        if (typeof botconfs.settings.tickets[req.params.ticketid] === 'undefined') return res.redirect('../error');

        const check = req.user.guilds[index];

        const ticket = botconfs.settings.tickets[req.params.ticketid];
        if (ticket.guildid !== req.params.id) return res.redirect('/servers');

        botconfs.settings.tickets[req.params.ticketid].newdate = moment(botconfs.settings.tickets[req.params.ticketid].date).format('MMMM Do YYYY, h:mm:ss a');

        const author = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${botconfs.settings.tickets[req.params.ticketid].authorid}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);

        botconfs.settings.tickets[req.params.ticketid].author = author ? author.tag : botconfs.settings.tickets[req.params.ticketid].authorid;

        /* eslint guard-for-in: 0 */
        for (const index2 in ticket.answers) {
          const author2 = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${ticket.answers[index2].authorid}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);
          ticket.answers[index2].author = author2 ? author2.tag : ticket.answers[index2].authorid;
          ticket.answers[index2].newdate = moment(ticket.answers[index2].date).format('MMMM Do YYYY, h:mm:ss a');
        }

        const islenoxbot = islenoxboton(req);

        const sortableAnswers = [];
        for (const key in botconfs.settings.tickets[req.params.ticketid].answers) {
          sortableAnswers.push(botconfs.settings.tickets[req.params.ticketid].answers[key]);
        }

        let answers;
        if (Object.keys(botconfs.settings.tickets[req.params.ticketid].answers).length === 0) {
          answers = false;
        }
        else {
          const answersOnTicket = sortableAnswers;
          answers = answersOnTicket.sort((a, b) => {
            if (a.date < b.date) {
              return 1;
            }
            if (a.date > b.date) {
              return -1;
            }
            return 0;
          });
        }

        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/ticket', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          ticket,
          answers,
          status: botconfs.settings.tickets[req.params.ticketid].status === 'open'
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/tickets', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        if (guildconfs.settings.dashboardticketpermissions) {
          if (((req.user.guilds[index].permissions) & guildconfs.settings.dashboardticketpermissions) !== guildconfs.settings.dashboardticketpermissions) return res.redirect('/servers');
        }
        else if (((req.user.guilds[index].permissions) & 6) !== 6) {
          return res.redirect('/servers');
        }

        if (!guild) return res.redirect('/servers');

        req.user.guilds[index].reactionnumber = guildconfs.settings.application.reactionnumber;

        const channels = guild.channels.filter((textChannel) => textChannel.type === 'text');
        const check = req.user.guilds[index];

        const newobject = {};
        const oldobject = {};

        for (const index2 in botconfs.settings.tickets) {
          const author = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${botconfs.settings.tickets[index2].authorid}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);
          if (botconfs.settings.tickets[index2].guildid === dashboardid && botconfs.settings.tickets[index2].status === 'open') {
            newobject[index2] = botconfs.settings.tickets[index2];
            botconfs.settings.tickets[index2].author = author ? author.tag : botconfs.settings.tickets[index2].authorid;
            botconfs.settings.tickets[index2].newdate = moment(botconfs.settings.tickets[index2].date).format('MMMM Do YYYY, h:mm:ss a');
          }
          if (botconfs.settings.tickets[index2].guildid === dashboardid && botconfs.settings.tickets[index2].status === 'closed') {
            oldobject[index2] = botconfs.settings.tickets[index2];
            botconfs.settings.tickets[index2].author = author ? author.tag : botconfs.settings.tickets[index2].authorid;
            botconfs.settings.tickets[index2].newdate = moment(botconfs.settings.tickets[index2].date).format('MMMM Do YYYY, h:mm:ss a');
          }
        }

        const commands = botconfs.settings.commands.filter((r) => r.category === 'tickets' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/tickets', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          ticketszero: Object.keys(newobject).length !== 0,
          tickets: newobject,
          ticketszeroold: Object.keys(oldobject).length !== 0,
          oldtickets: oldobject,
          commands,
          submittickets: !!req.query.submittickets
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/customcommands/customcommand/:command/submitdeletecommand', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        for (let i = 0; i < guildconfs.settings.customcommands.length; i += 1) {
          if (guildconfs.settings.customcommands[i].name === req.params.command.toLowerCase()) {
            guildconfs.settings.customcommands.splice(i, 1);
          }
        }

        guildconfs.settings.globallogs.push({
          action: 'deletedcustomcommand',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: req.params.command
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/customcommands`,
          query: {
            submitcustomcommands: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/customcommands/customcommand/:command/submitcommandstatuschange', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        for (let i = 0; i < guildconfs.settings.customcommands.length; i += 1) {
          if (guildconfs.settings.customcommands[i].name === req.params.command.toLowerCase()) {
            guildconfs.settings.customcommands[i].enabled = req.body.statuschange;
          }
        }

        guildconfs.settings.globallogs.push({
          action: 'togglecustomcommand',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: req.params.command
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/customcommands`,
          query: {
            submitcustomcommands: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/customcommands/customcommand/:command/submitcommandchange', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        let newDescription;
        const newResponse = req.body.newcommandanswer;
        if (req.body.newdescription) {
          newDescription = req.body.newdescription;
        }

        for (let i = 0; i < guildconfs.settings.customcommands.length; i += 1) {
          if (guildconfs.settings.customcommands[i].name === req.params.command.toLowerCase()) {
            guildconfs.settings.customcommands[i].description = newDescription;
            guildconfs.settings.customcommands[i].commandanswer = newResponse;
          }
        }

        guildconfs.settings.globallogs.push({
          action: 'customcommand',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: req.params.command
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/customcommands`,
          query: {
            submitcustomcommands: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/customcommands/submitnewcustomcommand', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        let newDescription;
        const newCommandName = req.body.newname;
        const newResponse = req.body.newcommandanswer;
        if (req.body.newdescription) {
          newDescription = req.body.newdescription;
        }

        for (let i = 0; i < guildconfs.settings.customcommands.length; i += 1) {
          if (guildconfs.settings.customcommands[i].name === newCommandName.toLowerCase()) {
            return res.redirect(url.format({
              pathname: '/error',
              query: {
                statuscode: 500,
                message: 'Custom command already exists!'
              }
            }));
          }
        }

        const newCustomCommandSettings = {
          name: newCommandName.toLowerCase(),
          creator: req.user.id,
          commandanswer: newResponse,
          descriptionOfTheCommand: newDescription,
          embed: 'false',
          commandCreatedAt: Date.now(),
          enabled: 'true'
        };

        guildconfs.settings.customcommands.push(newCustomCommandSettings);

        guildconfs.settings.globallogs.push({
          action: 'addedcustomcommand',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: req.params.command
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/customcommands`,
          query: {
            submitcustomcommands: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/customcommands', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });
        const botconfs = await botSettingsCollection.findOne({
          botconfs: 'botconfs'
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const evaledRoles = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").roles.array()`);
        guild.roles = evaledRoles;

        permissionsCheck(guildconfs, guild, req, res, index);

        const channels = [];
        const check = req.user.guilds[index];

        const commands = botconfs.settings.commands.filter((r) => r.category === 'customcommands' && r.dashboardsettings === true);
        for (let i = 0; i < commands.length; i += 1) {
          const englishstrings = require('./languages/en-US.json');
          commands[i].description = englishstrings[`${commands[i].name}_description`];
          if (guildconfs.settings.commands[commands[i].name].status === 'true') {
            commands[i].enabled = true;
          }
          else {
            commands[i].enabled = false;
          }

          commands[i].bannedchannels = guildconfs.settings.commands[commands[i].name].bannedchannels;
          commands[i].bannedroles = guildconfs.settings.commands[commands[i].name].bannedroles;
          commands[i].whitelistedroles = guildconfs.settings.commands[commands[i].name].whitelistedroles;
          commands[i].cooldown = guildconfs.settings.commands[commands[i].name].cooldown / 1000;
        }

        const roles = guild.roles.filter((r) => r.name !== '@everyone');

        if (!guildconfs.settings.customcommands) {
          guildconfs.settings.customcommands = [];
          await guildSettingsCollection.updateOne({
            guildId: dashboardid
          }, {
            $set: {
              settings: guildconfs.settings
            }
          });
        }

        const { customcommands } = guildconfs.settings;
        const lang = require(`./languages/website_${req.getLocale()}`);
        for (let index2 = 0; index2 < guildconfs.settings.customcommands.length; index2++) {
          const author = await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedUser = await this.users.fetch("${guildconfs.settings.customcommands[index2].creator}")
		if (fetchedUser) {
			return fetchedUser;
		}
    })();
`);
          customcommands[index2].newstatus = guildconfs.settings.customcommands[index2].enabled === 'true';

          customcommands[index2].website_dashboardcustomcommands_settings = lang.website_dashboardcustomcommands_settings.replace('%cmdname', customcommands[index2].name);
          customcommands[index2].website_dashboardcustomcommands_suretodelete = lang.website_dashboardcustomcommands_suretodelete.replace('%name', customcommands[index2].name);
          customcommands[index2].website_dashboardcustomcommands_created = lang.website_dashboardcustomcommands_created.replace('%creator', author ? author.tag : 'undefined').replace('%createdate', new Date(guildconfs.settings.customcommands[index2].commandCreatedAt).toUTCString());
        }

        const islenoxbot = islenoxboton(req);
        return res.render('dashboard/customcommands', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          channels,
          roles,
          commands,
          customcommands,
          isCustomCommands: customcommands.length !== 0,
          submitcustomcommands: !!req.query.submitcustomcommands
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/dashboard/:id/modules/submitmodules', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        permissionsCheck(guildconfs, guild, req, res, index);

        const name = Object.keys(req.body)[0];
        guildconfs.settings.modules[name.toLowerCase()] = req.body[name];

        guildconfs.settings.globallogs.push({
          action: `Activated/Deactivated the ${Object.keys(req.body)[0]} module!`,
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard'
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/modules`,
          query: {
            submitmodules: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/modules', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        permissionsCheck(guildconfs, guild, req, res, index);

        const evaledChannels = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").channels.array()`);
        guild.channels = evaledChannels;

        const check = req.user.guilds[index];

        const modules = {};

        const moduleslist = ['Moderation', 'Help', 'Music', 'Fun', 'Searches', 'NSFW', 'Utility', 'Application', 'Currency', 'Tickets', 'Customcommands'];
        const modulesIconsList = ['gavel', 'help', 'music', 'gamepad', 'magnify', 'alert', 'lightbulb-on', 'file-document-box-outline', 'currency-usd', 'ticket-account', 'console'];

        for (let i = 0; i < moduleslist.length; i += 1) {
          const config = {
            name: '',
            description: '',
            status: '',
            icon: ''
          };

          config.name = moduleslist[i];

          const lang = require(`./languages/${req.getLocale()}.json`);
          config.description = lang[`modules_${moduleslist[i].toLowerCase()}`];

          if (guildconfs.settings.modules[moduleslist[i].toLowerCase()] === 'true') {
            config.status = true;
          }
          else {
            config.status = false;
          }

          config.icon = modulesIconsList[i];

          modules[moduleslist[i].toLowerCase()] = config;
        }

        const islenoxbot = islenoxboton(req);
        const lang = require(`./languages/website_${req.getLocale()}`);
        return res.render('dashboard/modules', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          modules,
          submitmodules: !!req.query.submitmodules
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/dashboard/:id/lastlogs', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        permissionsCheck(guildconfs, guild, req, res, index);

        const check = req.user.guilds[index];
        let logs;

        const lang = require(`./languages/website_${req.getLocale()}`);
        if (guildconfs.settings.globallogs) {
          guildconfs.settings.globallogs.forEach((log) => {
            if (log.action.split(' ').length === 1) {
              let newAction = lang[`website_globalmodlog_${log.action}`];

              if (log.variable) {
                newAction = newAction.replace('%variable', log.variable);
              }
              log.action = newAction;
            }
            if (log.executed) {
              log.executed = lang[`website_globalmodlog_executed_${log.executed}`];
            }
            else {
              log.executed = lang.website_global_undefined;
            }
          });
          const thelogs = guildconfs.settings.globallogs;
          logs = thelogs.sort((a, b) => {
            if (a.date < b.date) {
              return 1;
            }
            if (a.date > b.date) {
              return -1;
            }
            return 0;
          });
        }
        else {
          logs = null;
        }

        const islenoxbot = islenoxboton(req);
        return res.render('dashboard/lastlogs', {
          languages: languages(req),
          lang,
          user: req.user,
          guilds: check,
          islenoxbot,
          logs
        });
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.get('/error', (req, res) => {
    const check = [];
    if (req.user) {
      for (let i = 0; i < req.user.guilds.length; i += 1) {
        if (((req.user.guilds[i].permissions) & 8) === 8) {
          check.push(req.user.guilds[i]);
        }
      }
    }

    let fix = false;
    let howtofix = '';

    if (req.query.message === "Cannot read property 'prefix' of null") {
      fix = true;
      howtofix = 'Write a textmessage in a textchannel on your discord server';
    }
    if (req.query.message === "Cannot read property 'dashboardpermissionroles' of null") {
      fix = true;
      howtofix = 'Write a textmessage in a textchannel on your discord server';
    }

    const islenoxbot = islenoxboton(req);
    const lang = require(`./languages/website_${req.getLocale()}`);
    res.status(404)
      .render('error', {
        lang,
        languages: languages(req),
        user: req.user,
        guilds: check,
        islenoxbot,
        statuscode: req.query.statuscode,
        message: req.query.message,
        fix,
        howtofix
      });
  });

  // Global post for commandstatuschange
  app.post('/dashboard/:id/global/:command/submitcommandstatuschange', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        permissionsCheck(guildconfs, guild, req, res, index);

        guildconfs.settings.commands[req.params.command].status = req.body.statuschange;

        guildconfs.settings.globallogs.push({
          action: 'togglemodule',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: req.params.command
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/modules`,
          query: {
            submit: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  // Global post for commandchange
  app.post('/dashboard/:id/global/:command/submitcommandchange', async (req, res) => {
    try {
      const dashboardid = req.params.id;
      if (req.user) {
        let index = -1;
        for (let i = 0; i < req.user.guilds.length; i += 1) {
          if (req.user.guilds[i].id === dashboardid) {
            index = i;
          }
        }

        if (index === -1) return res.redirect('/servers');

        const guildconfs = await guildSettingsCollection.findOne({
          guildId: dashboardid
        });

        let guild;
        await shardingManager.broadcastEval(`this.guilds.get("${dashboardid}")`)
          .then((guildArray) => {
            guild = guildArray.find((g) => g);
          });
        if (!guild) return res.redirect('/servers');

        const evaledMembers = await shardingManager.shards.get(guild.shardID).eval(`this.guilds.get("${dashboardid}").members.array()`);
        guild.members = evaledMembers;

        permissionsCheck(guildconfs, guild, req, res, index);

        guildconfs.settings.commands[req.params.command].bannedchannels = req.body.newblacklistedchannels;

        const channelsarray = [];
        const rolesarray = [];
        const whitelistedrolesarray = [];
        let newcooldown = '';
        if (req.body.newblacklistedchannels) {
          if (Array.isArray(req.body.newblacklistedchannels)) {
            for (let i = 0; i < req.body.newblacklistedchannels.length; i += 1) {
              channelsarray.push(req.body.newblacklistedchannels[i]);
            }
            guildconfs.settings.commands[req.params.command].bannedchannels = channelsarray;
          }
          else {
            channelsarray.push(req.body.newblacklistedchannels);
            guildconfs.settings.commands[req.params.command].bannedchannels = channelsarray;
          }
        }
        else {
          guildconfs.settings.commands[req.params.command].bannedchannels = [];
        }

        if (req.body.newblacklistedroles) {
          if (Array.isArray(req.body.newblacklistedroles)) {
            for (let i = 0; i < req.body.newblacklistedroles.length; i += 1) {
              rolesarray.push(req.body.newblacklistedroles[i]);
            }
            guildconfs.settings.commands[req.params.command].bannedroles = rolesarray;
          }
          else {
            rolesarray.push(req.body.newblacklistedroles);
            guildconfs.settings.commands[req.params.command].bannedroles = rolesarray;
          }
        }
        else {
          guildconfs.settings.commands[req.params.command].bannedroles = [];
        }

        if (req.body.newwhitelistedroles) {
          if (Array.isArray(req.body.newwhitelistedroles)) {
            for (let i = 0; i < req.body.newwhitelistedroles.length; i += 1) {
              whitelistedrolesarray.push(req.body.newwhitelistedroles[i]);
            }
            guildconfs.settings.commands[req.params.command].whitelistedroles = whitelistedrolesarray;
          }
          else {
            whitelistedrolesarray.push(req.body.newwhitelistedroles);
            guildconfs.settings.commands[req.params.command].whitelistedroles = whitelistedrolesarray;
          }
        }
        else {
          guildconfs.settings.commands[req.params.command].whitelistedroles = [];
        }

        newcooldown = Number(req.body.newcooldown) * 1000;
        guildconfs.settings.commands[req.params.command].cooldown = `${newcooldown}`;

        guildconfs.settings.globallogs.push({
          action: 'togglecommand',
          username: `${req.user.username}#${req.user.discriminator}`,
          date: Date.now(),
          showeddate: new Date().toUTCString(),
          executed: 'dashboard',
          variable: req.params.command
        });

        await guildSettingsCollection.updateOne({
          guildId: dashboardid
        }, {
          $set: {
            settings: guildconfs.settings
          }
        });
        await reloadGuild(guild, dashboardid);

        return res.redirect(url.format({
          pathname: `/dashboard/${dashboardid}/modules`,
          query: {
            submit: true
          }
        }));
      }
      return res.redirect('/loginpressedbutton');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  // API:
  // TODO: Fix newupvote api
  app.post('/api/newupvote', async (req, res) => {
    try {
      const { authorization } = req.body;
      const { userId } = req.body;
      const credits = Number(req.body.credits);

      if (authorization !== settings.dblAuthorization) return res.send(401, 'Invalid token');

      await shardingManager.shards.get(0).eval(`
			(async () => {
			const fetchedUser = await this.users.fetch("${userId}")
			if (fetchedUser) {
				fetchedUser.send('Thanks for upvoting LenoxBot on discordbots.org. As a thank you, you got ${credits} credits! :)')
				return fetchedUser;
			}
			})();
	`);

      let guild;
      await shardingManager.broadcastEval(`this.guilds.get("${settings.botMainDiscordServer}")`)
        .then((guildArray) => {
          guild = guildArray.find((g) => g);
        });

      if (guild) {
        await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedChannel = await this.channels.get('578207982677131265');
		if (fetchedChannel) {
			await fetchedChannel.send('<@${userId}> voted on discordbots.org and received ${credits} credits');
			return fetchedChannel;
		}
    })();
`);
      }

      const userconfs = await userSettingsCollection.findOne({
        userId
      });
      userconfs.settings.credits += credits;
      await userSettingsCollection.updateOne({
        userId
      }, {
        $set: {
          settings: userconfs.settings
        }
      });

      await reloadUser(userId);

      return res.status(200).send('Request successfully accepted!');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  app.post('/api/newacceptedissue', async (req, res) => {
    try {
      const { authorization } = req.body;
      const { userId } = req.body;
      const credits = Number(req.body.credits);

      if (authorization !== settings.dblAuthorization) return res.send(401, 'Invalid token');

      let guild;
      await shardingManager.broadcastEval(`this.guilds.get("${settings.botMainDiscordServer}")`)
        .then((guildArray) => {
          guild = guildArray.find((g) => g);
        });

      if (guild) {
        await shardingManager.shards.get(guild.shardID).eval(`
    (async () => {
		const fetchedChannel = await this.channels.get('578207982677131265');
		if (fetchedChannel) {
			await fetchedChannel.send('<@${userId}> created an accepted issue and received ${credits} credits');
			return fetchedChannel;
		}
    })();
`);
      }

      const userconfs = await userSettingsCollection.findOne({
        userId
      });
      userconfs.settings.credits += credits;
      await userSettingsCollection.updateOne({
        userId
      }, {
        $set: {
          settings: userconfs.settings
        }
      });

      await reloadUser(userId);

      return res.status(200).send('Request successfully accepted!');
    }
    catch (error) {
      return res.redirect(url.format({
        pathname: '/error',
        query: {
          statuscode: 500,
          message: error.message
        }
      }));
    }
  });

  // catch error and forward to error handler
  app.use((req, res) => {
    const err = new Error('Not Found');
    err.status = 404;
    return res.redirect(url.format({
      pathname: '/error',
      query: {
        statuscode: 404,
        message: 'Page not found'
      }
    }));
  });
}

run().catch((error) => {
  winstonLogger.error(error);
});
