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

router.get('/login-passport-google',
    Passport.authenticate('login-google', { scope: ['profile', 'email'] }),
    function (req, res, next) {
        res.send('Request is authenticated using Passport Local Authentication.');
    });

router.get('/google/callback',
  Passport.authenticate('login-google'), function (req, res) {
      // Insert data in User table
      User.findOne({ email: req.user.emails[0].value }, function (error, result) {
          if (!result) {
              var userPassword = MiddlewarePassport.CreateHash(req.user.emails[0].value);

              var collection = new User({
                  email: req.user.emails[0].value,
                  name: req.user.displayName,
                  username: req.user.displayName,
                  website: "",
                  bio: "",
                  phone_number: "",
                  gender: "",
                  profile_pic: "",
                  password: userPassword,
                  role: "user"
              });

              collection.save(function (error, rs) {
                  if (error) {
                      res.status(500).send('Database Error: ' + error);
                  }
                  else {
                      res.send('Request is authenticated using Passport Google Authentication.<br> User Details are::<br> ' + req.user.id + '<br>' + req.user.displayName + '<br>' + req.user.emails[0].value);

                  }
              });
          } else {
              res.send('Request is authenticated using Passport Google Authentication.<br> User Details are::<br> ' + req.user.id + '<br>' + req.user.displayName + '<br>' + req.user.emails[0].value);

          }
      });

  });

router.get('/login-jwt', MiddlewareJwt.Auth, function (req, res, next) {
    console.log(req.isAuthenticated());
    res.send('Request is authenticated using JWT.');
});

// Not being used--------------------------
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