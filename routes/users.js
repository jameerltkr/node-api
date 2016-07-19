var express = require('express');
var router = express.Router();

var bCrypt = require('bcrypt-nodejs');

var Passport = require('passport');

var User = require('../model/user');

var MiddlewarePassport = require('../middleware/passport');
var MiddlewareJwt = require('../middleware/jwt');

var Config = require('../bin/config');
var Meta = { code: Number, data_property_name: String, error: String };
var FinalData = {};

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log(req.isAuthenticated());
    console.log(req.user.role);
    res.send('respond with a resource');
});


//http://localhost:3000/api/users/create
router.post('/create', function (req, res, next) {

    /*console.log("------>data 2= ", req.body);
    console.log("Email is ", req.body.email);
    console.log("reqQuery - >", req.query);
    res.send(req.body.email);*/

    var userPassword = MiddlewarePassport.CreateHash(req.body.password);

    var collection = new User({
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
        password: userPassword,
        role: req.body.role
    });

    collection.save(function (error, result) {
        if (error) {
            console.log("Getting ERROR in users/add API.", error);

            if (error.name == 'ValidationError') {
                Meta.error = "Error: Validation Error.";
            } else {
                Meta.error = "Error: " + error;
            }
            Meta.code = 404;
            Meta.data_property_name = "";
            FinalData = error;
        }
        else {
            console.log("User saved successfully!");
            Meta.code = 200;
            Meta.data_property_name = "";
            Meta.error = "";
            FinalData = "User created inserted successfully.";
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data' : FinalData/*,
            'token': MiddlewareJwt.GenerateToken(result)*/
        });
        res.send(json);
    });
});

//localhost:3000/api/users/retrieve
router.get('/retrieve', function(req, res, next){
    User.find({}, function(error, result){
        if(error){
            console.log("> Getting Error in users/retrieve.",error);
            Meta.code = 404;
            Meta.error = "Error: "+error;
            Meta.data_property_name = "";
            FinalData = "";
        }else{
            Meta.code = 200;
            Meta.error = "";
            Meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data' : FinalData/*,
            'token': MiddlewareJwt.GenerateToken(result)*/
        });
        res.send(json);
    });
});
//localhost:3000/api/users/retrieve/:userId
router.get('/retrieve/:userId', function(req, res, next){
    User.findOne({_id: req.params.userId}, function(error, result){
        if(error){
            console.log("> Getting Error in users/retrieve/:userId.",error);
            Meta.code = 404;
            Meta.error = "Error: "+error;
            Meta.data_property_name = "";
            FinalData = "No record found for this userId.";
        }else{
            Meta.code = 200;
            Meta.error = "";
            Meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data' : FinalData/*,
            'token': MiddlewareJwt.GenerateToken(result)*/
        });
        res.send(json);
    });
});
//localhost:3000/api/users/retrieve/:userId
router.delete('/delete/:userId', function(req, res, next){
    User.remove({_id: req.params.userId}, function(error, result){
        if(error){
            console.log("> Getting Error in users/delete/:userId.",error);
            Meta.code = 404;
            Meta.error = "Error: "+error;
            Meta.data_property_name = "";
            FinalData = "No record found for this userId.";
        }else{
            Meta.code = 200;
            Meta.error = "";
            Meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data' : FinalData/*,
            'token': MiddlewareJwt.GenerateToken(result)*/
        });
        res.send(json);
    });
});




router.get('/login',
    Passport.authenticate('login'),
    function(req, res, next) {
        res.send('Request is authenticated against JWT.');
    });

router.post('/authenticate', function (req, res, next) {

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
