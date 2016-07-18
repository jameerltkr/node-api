var express = require('express');
var users = require('../model/user.js');
var router = express.Router();

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

var User = require('../model/user');
var config = require('../bin/config');
var meta  = { code : Number , data_property_name : String, error : String };
var finalData = {};

/* GET users listing. */
router.get('/', auth, function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/add', function(req, res, next){

  /*console.log("------>data 2= ", req.body);
  console.log("Email is ", req.body.email);
  console.log("reqQuery - >", req.query);
  res.send(req.body.email);*/
  var collection = new users({
    email: req.body.email,
    name: req.body.name,
    username: req.body.username,
    website: req.body.website,
    bio: req.body.bio,
    phone_number: req.body.phone_number,
    gender: req.body.gender,
    /*profile_pic:  
    {
      data: "data:image/png;base64,"+(fs.readFileSync(req.files.profile_pic.path)).toString('base64'), 
      contentType : 'image/png'
    },*/
    password:req.body.password
  });

  collection.save(function (error, result){
    if(error){
      console.log("Getting ERROR in users/add API.", error);

      if(error.name=='ValidationError'){
        meta.error = "Error: Validation Error.";
      }else{
        meta.error = "Error: "+error;  
      }
      meta.code = 404;
      meta.data_property_name = ""; 
      finalData = "";
    }
    else{
      console.log("User saved successfully!");
      meta.code = 200;
      meta.data_property_name = "";
      meta.error = "";
      finalData = result; 
    }
    var json = JSON.stringify({
      'meta' : meta,
      'data' : finalData
    });
    res.send(json);  
  });
});



router.get('/login', auth, function(req, res, next){
  res.send('Request is authenticated against JWT.');
})

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function(req, res, next) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    console.log(user);

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed+02+. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          expiresIn: 60*60*24 // expires in 24 hours
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

// route middleware to verify a token
function auth(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
};

module.exports = router;
