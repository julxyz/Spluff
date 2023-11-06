require('dotenv').config();

const Express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const nunjucks = require('nunjucks');

const app = Express();

nunjucks.configure(`${__dirname}/views`, {
	express: app,
});

app.set('view engine', 'njk');

app.use(session({
	cookie: {
		'secure': false,
		'maxAge': 86400000,
	},
	store: new MemoryStore({
		'checkPeriod': 86400000,
	}),
	'saveUninitialized': false,
	'resave': false,
	'secret': process.env.SESSION_SECRET,
}));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use((error, req, res, next) => {
	console.error(error.toString());

	return res.redirect('/error');
});

app.use(require('./routes/router.js'));

app.listen(process.env.PORT, () => console.log('HTTP backend server successfully launched!'));
