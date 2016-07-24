var express = require('express');
var router = express.Router();
var Follow = require('../model/follow');
var meta = { code: Number, data_property_name: String, error: String };
var finalData = {};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

//localhost:3000/api/follow/create
router.post('/create', function (req, res, next) {

    var collection = new Follow({
        follower_id: req.body.follower_id,
        following_id: req.body.following_id,
        is_follow_accepted: req.body.is_follow_accepted
    });

    collection.save(function (error, result) {
        if (error) {
            console.log("Getting ERROR in follow/create API.", error);

            if (error.name == 'ValidationError') {
                meta.error = "Error: Validation Error.";
            } else {
                meta.error = "Error: " + error;
            }
            meta.code = 404;
            meta.data_property_name = "";
            finalData = "";
        }
        else {
            console.log("Follow saved successfully!");
            meta.code = 200;
            meta.data_property_name = "data";
            meta.error = "";
            finalData = result;
        }
        var json = JSON.stringify({
            'meta': meta,
            'data': finalData
        });
        res.send(json);
    });
});

//localhost:3000/api/follow/retrieve
router.get('/retrieve', function (req, res, next) {
    Follow.find({})
    .populate('follower_id')
    .populate('following_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in follow/retrieve.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "";
        } else {
            meta.code = 200;
            meta.error = "";
            meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': meta,
            'data': FinalData
        });
        res.send(json);
    });
});
//localhost:3000/api/follow/retrieve/:statusId
router.get('/retrieve/:followId', function (req, res, next) {
    Follow.findOne({ _id: req.params.followId })
    .populate('follower_id')
    .populate('following_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in follow/retrieve/:followId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this followId.";
        } else {
            meta.code = 200;
            meta.error = "";
            meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': meta,
            'data': FinalData
        });
        res.send(json);
    });
});


//localhost:3000/api/follow/update/:followId
router.put('/update/:followId', function (req, res, next) {
    Follow.update({ '_id': req.params.followId }, req.body, { safe: true }, function (error, result) {
        if (error) {
            console.log("> Getting Error in follow/update/:followId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this followId.";
        } else {
            meta.code = 200;
            meta.error = "";
            meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': meta,
            'data': FinalData
        });
        res.send(json);
    });
});

//localhost:3000/api/follow/delete/:statusId
router.delete('/delete/:followId', function (req, res, next) {
    Follow.remove({ _id: req.params.followId }, function (error, result) {
        if (error) {
            console.log("> Getting Error in follow/delete/:followId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this followId.";
        } else {
            meta.code = 200;
            meta.error = "";
            meta.data_property_name = "data";
            FinalData = result;
        }
        var json = JSON.stringify({
            'meta': meta,
            'data': FinalData
        });
        res.send(json);
    });
});
module.exports = router;
