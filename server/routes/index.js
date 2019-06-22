const homeRoute = require('./home');
const errorRoute = require('./error');

function init(app) {
	app.get('/home', (req, res) => {
		res.redirect('/');
	});

	app.use('/', homeRoute);
	app.use('/error', errorRoute);
}

module.exports = {
	init: init
};
