// User Login

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../model/user');
var bCrypt = require('bcrypt-nodejs');

var Jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var Config = require('../bin/config');
var User = require('../model/user');

//======================================================================//
//==================== Passport Local Login ============================//
//======================================================================//
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
  function (req, username, password, done) {
      console.log('Checking in Mongo if user exist or not');
      // check in mongo if a user with username exists or not
      User.findOne({ 'email': username },
        function (err, user) {
            // In case of any error, return using the done method
            if (err)
                return done(err);
            // Username does not exist, log error & redirect back
            if (!user) {
                console.log('User Not Found with username ' + username);

                req.session.loginmessage = 'User not found.';

                return done(null, false,
                      { 'message': 'User Not found.' });
            }
            // User exists but wrong password, log the error 
            if (!IsValidPassword(user, password)) {
                console.log('Invalid Password');

                req.session.loginmessage = 'Invalid password';

                return done(null, false,
                    { 'message': 'Invalid Password' });
            }

            // Restrict to Providers
            if (user.is_provider != undefined || user.is_provider == true) {
                console.log('Invalid Login');

                req.session.loginmessage = 'Invalid login';

                return done(null, false,
                    { 'message': 'Invalid login' });
            }

            req.session.loginmessage = null;
            // User and password both match, return user from 
            // done method which will be treated like success
            return done(null, user);
        }
      );
  }));


// User Signup
passport.use('signup', new LocalStrategy({
    passReqToCallback: true
},
  function (req, username, password, done) {
      console.log('before find or create user');
      findOrCreateUser = function () {
          console.log('Check for user existance: Sign Up');
          // find a user in Mongo with provided username
          User.findOne({ 'username': username }, function (err, user) {
              // In case of any error return
              if (err) {
                  console.log('Error in SignUp: ' + err);
                  return done(err);
              }
              // already exists
              if (user) {
                  console.log('User already exists');
                  return done(null, false,
                     req.flash('message', 'User Already Exists'));
              } else {
                  // if there is no user with that email
                  // create the user
                  var newUser = new User();
                  // set the user's local credentials
                  newUser.username = username;
                  newUser.password = CreateHash(password);

                  // save the user
                  newUser.save(function (err) {
                      if (err) {
                          console.log('Error in Saving user: ' + err);
                          return done(null, false,
                     req.flash('message', 'Error'));
                      }
                      console.log('User Registration succesful');
                      return done(null, newUser);
                  });
              }
          });
      };

      // Delay the execution of findOrCreateUser and execute 
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
  }));

//======================================================================//
//=================== Passport Google Auth =============================//
//======================================================================//
passport.use('login-google', new GoogleStrategy({
    clientID: '402166863300-ullhvi45ckloelig76o5is28nuif38gt.apps.googleusercontent.com',
    clientSecret: 'ytt2tWh62YecK_M_H9b6WSUO',
    callbackURL: "http://localhost:3000/api/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));

//======================================================================//
//=================== Passport Facebook Auth ===========================//
//======================================================================//
passport.use('facebook', new FacebookStrategy({
    clientID: '645070845600878',
    clientSecret: '11cf203fd12209b6945a6622632ff648',
    callbackURL: "http://localhost:3000/api/auth/facebook/callback",
    profileFields: ['email', 'first_name', 'last_name']
},

  // facebook will send back the tokens and profile
  function (access_token, refresh_token, profile, done) {
      // asynchronous
      process.nextTick(function () {

          // find the user in the database based on their facebook id
          User.findOne({ 'email': profile.emails[0].value }, function (err, user) {

              // if there is an error, stop everything and return that
              // ie an error connecting to the database
              if (err)
                  return done(err);

              // if the user is found, then log them in
              if (user) {
                  return done(null, user); // user found, return that user
              } else {
                  // if there is no user found with that facebook id, create them
                  var newUser = new User();

                  // set all of the facebook information in our user model
                  newUser.name = profile.name.givenName;
                  newUser.username = profile.name.givenName;
                  newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                  newUser.role = "user";

                  // save our user to the database
                  newUser.save(function (err) {
                      if (err)
                          throw err;

                      // if successful, return the new user
                      return done(null, newUser);
                  });
              }
          });
      });
  }));

var IsValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
var CreateHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = {
    CreateHash: CreateHash
};