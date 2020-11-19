const express = require('express');
const path = require('path');
const http = require("http");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const i18n = require("i18n-express");
const session = require('express-session');
const flash = require('connect-flash');
const breadcrumbs = require('express-breadcrumbs');
const ejsLayouts = require("express-ejs-layouts");

const app = express();

// dotenv configuration
require('dotenv').config()

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(ejsLayouts);
app.use(cors());

// flash messages variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.error = req.flash('error');
  next();
});

// view engine setup
app.set("view engine", "ejs");
app.set("views", "./views");

// i18n config
app.use(i18n({
  translationsPath: path.join(__dirname, '/config/locales'),
  siteLangs: ["pt", "en"],
  textsVarName: 'i18n',
  defaultLang: 'en-EN',
  paramLangName: 'lang'
}));

// middleware
app.use(breadcrumbs.init());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// set port
app.set("port", process.env.APP_PORT);

// set routes
const indexRouter = require('./routes/index');

// use routes
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;

  // render 404 error page
  if (req.accepts('html')) {
      res.render('404', {
          err: err,
          pathTo: req.app.locals.baseProject,
          backUrl: req.app.locals.baseUrl + req.baseUrl,
          layout: '404'
      });
      return;
  }
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

http.createServer(app).listen(app.get("port"), function (req) {
  console.log("[EXPRESS SERVER] HTTP Express server on port: " + app.get("port"));
});
