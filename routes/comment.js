var express = require('express');
var router = express.Router();
var Comment = require('../model/comment');
var CommentLike = require('../model/comment-like');
var Status = require('../model/status');
var meta = { code: Number, data_property_name: String, error: String };
var finalData = {};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

//localhost:3000/api/comment/create
router.post('/create', function (req, res, next) {

    var collection = new Comment({
        text: req.body.text,
        status_id: req.body.status_id,
        user_id: req.body.user_id
    });

    collection.save(function (error, result) {
        if (error) {
            console.log("Getting ERROR in /comment/create API.", error);

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
            /*Push into status array*/
            Status.update({ _id: req.body.status_id }, { $pushAll: { comments: [result._id] } }, { upsert: true }, function (err, result) {
                if (err) {
                    console.log("Getting ERROR in /comment/create Status push API.", err);
                    meta.code = 404;
                    meta.error = "Error: " + err;
                    meta.data_property_name = "";
                    finalData = "Validation Error";
                } else {
                    console.log("Status comment successfully added.");
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
        }
    });
});

//localhost:3000/api/comment/retrieve
router.get('/retrieve', function (req, res, next) {
    Comment.find({})
    .populate('status_id')
    .populate('user_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in comment/retrieve.", error);
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



//localhost:3000/api/comment/retrieve/:commentId
router.get('/retrieve/:commentId', function (req, res, next) {
    Comment.findOne({ _id: req.params.commentId })
    .populate('status_id')
    .populate('user_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in comment/retrieve/:commentId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this commentId.";
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


//localhost:3000/api/comment/retrieve-by-user/:userId
router.get('/retrieve-by-user/:userId', function (req, res, next) {
    Comment.findOne({ user_id: req.params.userId })
    .populate('status_id')
    .populate('user_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in comment/retrieve-by-user/:userId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this userId.";
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

//localhost:3000/api/comment/retrieve-by-status/:status_id
router.get('/retrieve-by-status/:status_id', function (req, res, next) {
    Comment.findOne({ status_id: req.params.status_id })
    .populate('status_id')
    .populate('user_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in comment/retrieve-by-status/:status_id.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this status_id.";
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

//localhost:3000/api/comment/update/:commentId
router.put('/update/:commentId', function (req, res, next) {
    Comment.update({ '_id': req.params.commentId }, req.body, { safe: true }, function (error, result) {
        if (error) {
            console.log("> Getting Error in comment/update/:commentId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this commentId.";
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

//localhost:3000/api/comment/delete/:statusId
router.delete('/delete/:commentId', function (req, res, next) {
    Comment.remove({ _id: req.params.commentId }, function (error, result) {
        if (error) {
            console.log("> Getting Error in comment/delete/:commentId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this commentId.";
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


router.post('/add-comment-like', function (req, res, next) {

    var collection = new CommentLike({
        comment_id: req.body.comment_id,
        user_id: req.body.user_id
    });

    collection.save(function (error, result) {
        if (error) {
            console.log("Getting ERROR in reports/add API.", error);

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

            console.log("Comment-like saved successfully!");
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

module.exports = router;
