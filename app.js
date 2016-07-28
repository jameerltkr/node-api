var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var passport = require('passport');

var myDB = require('./model/DB');

var roleManagement = require('./middleware/role-management');

var routes = require('./routes/index');
var authentication = require('./routes/authentication');
var users = require('./routes/users');
var status = require('./routes/status');
var comment = require('./routes/comment');
var follow = require('./routes/follow');
var report = require('./routes/report');
var User = require('./model/user');
var app = express();

var config = require('./bin/config'); // get our config file

var ErrorLog = {
    Status: Number,
    Message: String
};

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
//app.use(require('express-session')({
//    secret: 'keyboard_blob',
//    resave: false,
//    saveUninitialized: false
//}));

app.use(session({ secret: config.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(roleManagement.middleware());

app.set('superSecret', config.secret); // secret variable

// passport needs ability to serialize and deserialize users out of session
passport.serializeUser(function (user, done) {
    //done(null, user._id);
    done(null, user);
});
passport.deserializeUser(function (obj, done) {
    //User.findById(id, function (err, user) {
    //    done(err, user);
    //});
    done(null, obj);
});

app.use('/api', routes);
app.use('/api/auth', authentication);
app.use('/api/users', users);
app.use('/api/status', status);
app.use('/api/comment', comment);
app.use('/api/follow', follow);
app.use('/api/report', report);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
    ErrorLog.Status = err.status;
    ErrorLog.Message = 'The API you are looking for is not found.';
    res.send(ErrorLog);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        /*
        res.render('error', {
            message: err.message,
            error: err
        });
		*/
        ErrorLog.Status = err.status;
        ErrorLog.Message = err.message;
        res.send(ErrorLog);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    /*
    res.render('error', {
        message: err.message,
        error: {}
    });
	*/
    ErrorLog.Status = err.status;
    ErrorLog.Message = '';
    res.send(ErrorLog);
});

module.exports = app;
