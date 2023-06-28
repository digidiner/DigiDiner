process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

var createError = require('http-errors');
var express = require('express');
var https = require('https');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var glob = require('glob');

var app = express();

var conn = await require('./controllers/databaseController.js').getConnection();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Loads all models from the models directory
glob.sync('./models/**/*.js').forEach(function(file) {
  require(path.resolve(file)).connectDatabase(conn);
});

// Loads all routes from the routes directory
glob.sync('./routes/**/*.js').forEach(function (file) {
  let route = file.slice(6, -3).replaceAll('\\', '/');
  if (route.endsWith('index')) {
    route = route.slice(0, -5);
  }
  app.use(route, require(path.resolve(file)));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.code = err.status || 500;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
