var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');							// https://www.npmjs.com/package/express-session
const passport = require('passport');								// https://www.npmjs.com/package/passport
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;	// https://www.npmjs.com/package/ibmcloud-appid
const config = require('config');

var apiRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const CloudantStore = require('connect-cloudant-store')(session);
const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({
  url: config.get('cloudant.url'),
  plugins: {
    iamauth: {
      iamApiKey: config.get('cloudant.apikey')
    }
  }
});
const store = new CloudantStore({
  client: cloudant,
  ttl: 3600
});
app.use(session({
  secret: '123456',
  resave: true,
  saveUninitialized: true,
  store
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({
  tenantId: config.get('appid.tenantId'),
  clientId: config.get('appid.clientId'),
  secret: config.get('appid.secret'),
  oauthServerUrl: config.get('appid.oAuthServerUrl'),
  redirectUri: `${config.get('url')}/auth/authenticate`
}));
app.get('/auth/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
  successRedirect: '/',
  forceLogin: true
}));
app.get('/auth/authenticate', passport.authenticate(WebAppStrategy.STRATEGY_NAME));
app.get('/auth/logout', (req, res) =>{
  WebAppStrategy.logout(req);
  res.redirect('/');
});

app.use('/api/', apiRouter);

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

module.exports = app;
