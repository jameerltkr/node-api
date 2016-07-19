// User Login

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');
var bCrypt = require('bcrypt-nodejs');

passport.use('login', new LocalStrategy({
    passReqToCallback: true
},
  function (req, username, password, done) {
      console.log('Checking in Mongo if user exist or not');
      // check in mongo if a user with username exists or not
      User.findOne({ 'username': username },
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
            if (!isValidPassword(user, password)) {
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
                  newUser.password = createHash(password);

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

var isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}

// Generates hash using bCrypt
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}