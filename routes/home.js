/* eslint-disable no-restricted-syntax */
var router = require('express').Router();
const islenoxboton = require('../middleware/islenoxboton');
const languages = require('../middleware/languages');
const botSettingsCollection = require('../models/botSettings');

router.get('/', async (req, res) => {
  try {
  console.log('Called / route');
  const check = [];
  if (req.user) {
    for (let i = 0; i < req.user.guilds.length; i += 1) {
      if (((req.user.guilds[i].permissions) && 8) === 8) {
        check.push(req.user.guilds[i]);
      }
    }
  }
  console.log(35);

  const lang = require(`../languages/website_${req.getLocale()}`);
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
  console.log(36);

  const ratings = [];
  for (let i = 0; i < ratingsQuotes.length; i += 1) {
    ratings.push({ quote: ratingsQuotes[i], cite: ratingsCite[i] });
  }
  console.log(31);

  const islenoxbot = islenoxboton(req);
  console.log(3);
  const botConfs = await botSettingsCollection.findOne({
    botconfs: 'botconfs'
  });
  console.log(4);

  console.log('Called / route2');
  return res.render('index', {
    languages: languages(req),
    lang,
    ratings,
    user: req.user,
    guilds: check,
    islenoxbot,
    botguildscount: botConfs.settings.botstats.botguildscount,
    botmemberscount: botConfs.settings.botstats.botmemberscount,
    botcommands: botConfs.settings.botstats.botcommands
  });
      
} catch (error) {
    console.log(error)
}
});

module.exports = router;
