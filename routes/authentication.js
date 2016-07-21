var express = require('express');
var router = express.Router();

var bCrypt = require('bcrypt-nodejs');

var Passport = require('passport');

var User = require('../model/user');
var roleUser = require('../middleware/role-management');

var MiddlewarePassport = require('../middleware/passport');
var MiddlewareJwt = require('../middleware/jwt');

var Config = require('../bin/config');

router.get('/login-passport-local',
    Passport.authenticate('login'),
    function (req, res, next) {
        res.send('Request is authenticated using Passport Local Authentication.');
    });
	
router.get('/login-jwt', MiddlewareJwt.Auth, function (req, res, next) {
	console.log(req.isAuthenticated());
    res.send('Request is authenticated using JWT.');
});

router.post('/signup-jwt-test', function (req, res, next) {

    // find the user
    User.findOne({
        name: req.body.name
    }, function (err, user) {

        console.log(user);

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, Config.secret, {
                    expiresIn: 60 * 60 * 24 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

module.exports = router;