const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const request = require('request');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


/* APP SET UP -- uses express */
var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

  	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

/* SPOTIFY API */
var spotifyApi = new SpotifyWebApi({
  clientId: 'f837cdd99b2c472091582b78bf634f07',
  clientSecret: 'REMOVED FOR PRIVACY PURPOSES',
  redirectUri: 'http://localhost:5000/callback'
});

var access_token = "BQD00M24UDTrtv77xV00dattsXexKsdRrFGgM51Bqotg3INFMO3YMd_PsgfeZ_0fLaraQfq2RwO-vGLfGEcqSxUfnCsUeDfdDFFlAtrvWMMWG3FZRPPo1jVsl-d4d4wHb1EwPYqQDtWcqir_fgB6oSq97i8IKuXO9phuF1ufNiODmddDn5_E&refresh_token=AQAdrdL8lc--ooyT9JJDnlV0-xIVEi_oZWmUA1bPMz6WUIexkAQ3OQNcndN9Cg_tjiB1uhPp02wamxrSxjySrV_uI-CYBx1dA4MMTECEMF3W1XJlptULCIQ4jCsl7zsHbXIeCg"

spotifyApi.setAccessToken( access_token );

spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
	function(data) {
    	console.log('Artist albums', data.body);
	},
	function(err) {
    	console.error(err);
	}
);

// Export App and MySQL pool for use
module.exports = app;

// Start listening port
console.log('Listening on 5000');
app.listen(5000);

