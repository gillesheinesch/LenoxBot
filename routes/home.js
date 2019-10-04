var router = require('express').Router();

router.get('/', async (req, res) => {
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
});

module.exports = router;
