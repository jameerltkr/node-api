var express = require('express');
var router = express.Router();
var Status = require('../model/status');
var StatusLike = require('../model/status-like');
var roleUser = require('../middleware/role-management');
var meta = { code: Number, data_property_name: String, error: String };
var finalData = {};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/create', roleUser.can("access api"), function (req, res, next) {
    /*Initially when status gets created then it will have no comments of likes.*/
    var collection = new Status({
        text: req.body.text,
        user_id: req.body.user_id
    });

    collection.save(function (error, result) {
        if (error) {
            console.log("Getting ERROR in status/create API.", error);

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
            console.log("Status created successfully!");
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

//localhost:3000/api/status/retrieve
router.get('/retrieve', roleUser.can("access api"), function (req, res, next) {

    Status.find({})
    .populate('likes')
    .populate('comments')
    .populate('user_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in status/retrieve.", error);
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
//localhost:3000/api/status/retrieve/:statusId
router.get('/retrieve/:statusId', roleUser.can("access api"), function (req, res, next) {
    Status.findOne({ _id: req.params.statusId })
    .populate('likes')
    .populate('comments')
    .populate('user_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in status/retrieve/:statusId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this statusId.";
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

//localhost:3000/api/status/update/:statusId
router.put('/update/:statusId', roleUser.can("access api"), function (req, res, next) {
    Status.update({ '_id': req.params.statusId }, req.body, { safe: true }, function (error, result) {
        if (error) {
            console.log("> Getting Error in status/update/:statusId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this statusId.";
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

//localhost:3000/api/status/delete/:statusId
router.delete('/delete/:statusId', roleUser.can("access api"), function (req, res, next) {
    Status.remove({ _id: req.params.statusId }, function (error, result) {
        if (error) {
            console.log("> Getting Error in status/delete/:statusId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this statusId.";
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


//localhost:3000/api/status/like/create
router.post('/like/create', roleUser.can("access api"), function (req, res, next) {

    var collection = new StatusLike({
        status_id: req.body.status_id,
        user_id: req.body.user_id
    });

    collection.save(function (error, result) {
        if (error) {
            console.log("Getting ERROR in /like/create API.", error);

            if (error.name == 'ValidationError') {
                meta.error = "Error: Validation Error.";
            } else {
                meta.error = "Error: " + error;
            }
            meta.code = 404;
            meta.data_property_name = "";
            finalData = "Validation Error";
        }
        else {
            /*push into status table*/
            Status.update({ _id: req.body.status_id }, { $pushAll: { likes: [result._id] } }, { upsert: true }, function (err, result) {
                if (err) {
                    console.log("Getting ERROR in /like/create  API.", err);
                    meta.code = 404;
                    meta.error = "Error: " + err;
                    meta.data_property_name = "";
                    finalData = "Validation Error";
                } else {
                    console.log("Status like successfully added.");
                    meta.code = 200;
                    meta.data_property_name = "data";
                    meta.error = "";
                    finalData = result;
                }
            });
        }
        var json = JSON.stringify({
            'meta': meta,
            'data': finalData
        });
        res.send(json);
    });
});

module.exports = router;
