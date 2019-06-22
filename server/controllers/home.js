const url = require('url');

function islenoxboton(req) {
	const islenoxbot = [];
	if (req.user) {
		for (let i = 0; i < req.user.guilds.length; i++) {
			if (((req.user.guilds[i].permissions) & 8) === 8 && req.user.guilds[i].lenoxbot === true) {
				islenoxbot.push(req.user.guilds[i]);
			}
		}
	}
	return islenoxbot;
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
	}];

	const currentLanguage = req.getLocale();
	for (let i = 0; i < languagesList.length; i++) {
		if (languagesList[i].fileName === currentLanguage) {
			languagesList[i].status = true;
		}
	}
	return languagesList;
}

async function index(req, res) {
	try {
		const check = [];
		if (req.user) {
			for (let i = 0; i < req.user.guilds.length; i++) {
				if (((req.user.guilds[i].permissions) & 8) === 8) {
					check.push(req.user.guilds[i]);
				}
			}
		}

		const islenoxbot = islenoxboton(req);

		const botSettingsCollection = await require('../database/index').botSettingsCollection();
		const botConfs = await botSettingsCollection.findOne({
			botconfs: 'botconfs'
		});

		const lang = require(`../../languages/website_${req.getLocale()}`);
		return res.render('index', {
			languages: languages(req),
			lang: lang,
			user: req.user,
			guilds: check,
			islenoxbot: islenoxbot,
			botguildscount: botConfs.settings.botstats.botguildscount,
			botmemberscount: botConfs.settings.botstats.botmemberscount,
			botcommands: botConfs.settings.botstats.botcommands
		});
	} catch (error) {
		return res.redirect(url.format({
			pathname: `/error`,
			query: {
				statuscode: 500,
				message: error.message
			}
		}));
	}
}

module.exports = {
	index: index
};
