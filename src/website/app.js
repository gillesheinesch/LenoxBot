const express = require('express');
const session = require('express-session');
const parser = require('body-parser');
const cookie = require('cookie-parser');
const path = require('path');
const url = require('url');
const app  = new express();

module.exports = (client) => {
    app.use(cookie());

    app.set(parser.json());
    app.set(parser.urlencoded({
        limit: '50mb',
        extended: false
    }));

    app.use(session({
        secret: '@#$#(*)_()*(*^%@$@4#^36543%$#%$@%#@',
        resave: false,
        saveUninitialized: false
    }));

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'handlebars');

    app.use(express.static('public'));

    const render = (req, res, file, extended = {}) => {
        const options = { 
            client: client,
            user: req.user
        };

        return res.render(file, Object.assign(options, extended));
    };

    app.get('/invite', (req, res) => res.redirect(client.generateInvite(["ADMINISTRATOR"])));
    app.get('/support', (req, res) => res.redirect(client.constants.guild.invite));
    app.get('/status', (req, res) => res.redirect('https://status.lenoxbot.com/'));

    app.get('/vote', (req, res) => {
        try { return render(req, res, 'vote'); } catch (error) { return res.redirect(url.format({ pathname: '/error', query: { statuscode: 500, message: error.message }})); }
    });
};