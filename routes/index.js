var router = require('express').Router();

// route /home or /
router.get('/', require('./home'));
router.get('/home', require('./home'));

// route /commands
router.get('/commands', require('./commands'));

// route /team
router.get('/team', require('./team'));

// route /test
router.get('/test', require('./test'));

// route /vote
router.get('/vote', require('./vote'));

// route /policy
router.get('/policy', require('./policy'));

// route /dataprotection
router.get('/dataprotection', require('./dataprotection'));

// route /leaderboards
router.get('/leaderboards', require('./leaderboards/'));

// route /profile
router.get('/profile', require('./profile/'));

// route /donate
router.get('/donate', require('./donate'));

// route /donationsuccess
router.get('/donationsuccess', require('./donationsuccess'));

// route /servers
router.get('/servers', require('./servers'));

// route /tickets
router.get('/tickets', require('./tickets/'));

// route /dashboard
router.get('/dashboard', require('./dashboard/'));

// route /api
router.get('/api', require('./api/'));

// Redirections
router.get('/invite', (req, res) => res.redirect('https://discordapp.com/oauth2/authorize?client_id=354712333853130752&scope=bot&permissions=8'));
router.get('/discord', (req, res) => res.redirect('https://discordapp.com/invite/jmZZQja'));
router.get('/status', (req, res) => res.redirect('https://status.lenoxbot.com/'));
router.get('/ban', (req, res) => res.redirect('https://goo.gl/forms/NKoVsl8y5wOePCYT2'));
router.get('/apply', (req, res) => res.redirect('https://goo.gl/forms/jOyjxAheOHaDYyoF2'));
router.get('/survey', (req, res) => res.redirect('https://goo.gl/forms/2sS8U9JoYjeWHFF83'));
router.get('/documentation', (req, res) => res.redirect('https://docs.lenoxbot.com'));

// route /error
router.get('/error', require('./error'));

module.exports = router;
