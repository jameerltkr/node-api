var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var roleManagement = require('./middleware/role-management');

var mydb = require('./model/DB');
var routes = require('./routes/index');
var users = require('./routes/users');
var status = require('./routes/status');
var comment = require('./routes/comment');
var follow = require('./routes/follow');
var report = require('./routes/report');
var User = require('./model/user');
var app = express();

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./bin/config'); // get our config file

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
    secret: 'keyboard_blob',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(roleManagement.middleware());

app.set('superSecret', config.secret); // secret variable

// passport needs ability to serialize and deserialize users out of session
passport.serializeUser(function (user, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

app.use('/api', routes);
app.use('/api/users', users);
app.use('/api/status', status);
app.use('/api/comment', comment);
app.use('/api/follow', follow);
app.use('/api/report', report);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
