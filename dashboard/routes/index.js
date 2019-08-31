const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', async (req, res, next) => {
	const bot = await axios({
		method: 'get',
		url: 'http://127.0.0.1:4000/api/application'
	})
		.then(res2 => res2.data)
		.catch(e => console.log(e));

	const lang = require(`../public/lang/${req.getLocale()}`);

	res.render('index', {
		title: 'Express',
		bot,
		lang
	});
});

router.get('/commands', async (req, res, next) => {
	const commands = await axios({
		method: 'get',
		url: 'http://127.0.0.1:4000/api/commands'
	})
		.then(res2 => res2.data)
		.catch(e => console.log(e));

	const lang = require(`../public/lang/${req.getLocale()}`);

	res.render('commands', {
		commands,
		lang
	});
});

module.exports = router;
