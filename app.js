var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
//~line 7 after mongoose
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./models/users');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var config = require('./config.dev');
var apiUsersRouter = require('./routes/api/users');
var apiAuthRouter = require('./routes/api/auth');
//Test the file
// console.log(config);
var app = express();
//Connect to MongoDB
mongoose.connect(config.mongodb, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//~line 32 before routes
app.use(require('express-session')({
  //Define the session store
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  //Set the secret
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: '/',
    domain: config.cookie.domain,
    //httpOnly: true,
    //secure: true,
    maxAge:3600000 //1 hour
  }
}));
passport.use(Users.createStrategy());
app.use(passport.initialize());
app.use(passport.session());
//~line 53
passport.serializeUser(function(user, done){
  done(null,{
    id: user._id,
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name
  });
});
passport.deserializeUser(function(user, done){
  done(null, user);
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/auth', apiAuthRouter);
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