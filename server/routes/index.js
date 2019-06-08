const homeRoute = require('./home');
const errorRoute = require('./error');

function init(app) {
	app.get('/home', (req, res) => {
		res.redirect('/');
	});

	app.use('/', homeRoute);
	app.use('/error', errorRoute);
	app.use('submitnewwebsitelanguage', homeRoute.)
}

module.exports = {
	init: init
};
