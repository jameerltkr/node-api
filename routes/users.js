var express = require('express');
var router = express.Router();

var User = require('../model/user');
var roleUser = require('../middleware/role-management');

var MiddlewarePassport = require('../middleware/passport');
var MiddlewareJwt = require('../middleware/jwt');

var Config = require('../bin/config');
var Meta = { code: Number, data_property_name: String, error: String };
var FinalData = {};

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log(req.isAuthenticated());
    res.send('respond with a resource');
});

//http://localhost:3000/api/users/signup
router.post('/signup', roleUser.can("register"), function (req, res, next) {

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
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data': FinalData,
            'token': MiddlewareJwt.GenerateToken(result)
        });
        res.send(json);
    });
});

//localhost:3000/api/users/retrieve
router.get('/retrieve', roleUser.can('access all'), function (req, res, next) {
    User.find({}, function (error, result) {
        if (error) {
            console.log("> Getting Error in users/retrieve.", error);
            Meta.code = 404;
            Meta.error = "Error: " + error;
            Meta.data_property_name = "";
            FinalData = "";
        } else {
            Meta.code = 200;
            Meta.error = "";
            Meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data': FinalData
        });
        res.send(json);
    });
});

//localhost:3000/api/users/retrieve/:userId
router.get('/retrieve/:userId', roleUser.can('retrieve user'), function (req, res, next) {
    User.findOne({ _id: req.params.userId }, function (error, result) {
        if (error) {
            console.log("> Getting Error in users/retrieve/:userId.", error);
            Meta.code = 404;
            Meta.error = "Error: " + error;
            Meta.data_property_name = "";
            FinalData = "No record found for this userId.";
        } else {
            Meta.code = 200;
            Meta.error = "";
            Meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data': FinalData
        });
        res.send(json);
    });
});

//localhost:3000/api/users/update/:userId
router.put('/update/:userId', roleUser.can('update user'), function (req, res, next) {
    User.update({ '_id': req.params.userId }, req.body, { safe: true }, function (error, result) {
        if (error) {
            console.log("> Getting Error in users/update/:userId.", error);
            Meta.code = 404;
            Meta.error = "Error: " + error;
            Meta.data_property_name = "";
            FinalData = "No record found for this userId.";
        } else {
            Meta.code = 200;
            Meta.error = "";
            Meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data': FinalData
        });
        res.send(json);
    });
})

//localhost:3000/api/users/delete/:userId
router.delete('/delete/:userId', roleUser.can('delete user'), function (req, res, next) {
    User.remove({ _id: req.params.userId }, function (error, result) {
        if (error) {
            console.log("> Getting Error in users/delete/:userId.", error);
            Meta.code = 404;
            Meta.error = "Error: " + error;
            Meta.data_property_name = "";
            FinalData = "No record found for this userId.";
        } else {
            Meta.code = 200;
            Meta.error = "";
            Meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': Meta,
            'data': FinalData
        });
        res.send(json);
    });
});

module.exports = router;
