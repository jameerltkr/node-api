var express = require('express');
var router = express.Router();
var Comment = require('../model/comment');
var commentLike = require('../model/comment-like');
var meta = { code: Number, data_property_name: String, error: String };
var finalData = {};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/add-comment', function (req, res, next) {

    var collection = new Comment({
        text: req.body.text,
        status_id: req.body.status_id,
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
            /*Push into status array*/
            console.log("Comment saved successfully!");
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

//localhost:3000/api/comment/retrieve
router.get('/retrieve', function(req, res, next){
    Comment.find({}, function(error, result){
        if(error){
            console.log("> Getting Error in comment/retrieve.", error);
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
//localhost:3000/api/comment/retrieve/:commentId
router.get('/retrieve/:commentId', function(req, res, next){
    Comment.findOne({_id: req.params.commentId}, function(error, result){
        if(error){
            console.log("> Getting Error in comment/retrieve/:commentId.",error);
            Meta.code = 404;
            Meta.error = "Error: "+error;
            Meta.data_property_name = "";
            FinalData = "No record found for this commentId.";
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
//localhost:3000/api/comment/delete/:statusId
router.delete('/delete/:commentId', function(req, res, next){
    Comment.remove({_id: req.params.commentId}, function(error, result){
        if(error){
            console.log("> Getting Error in comment/delete/:commentId.",error);
            Meta.code = 404;
            Meta.error = "Error: "+error;
            Meta.data_property_name = "";
            FinalData = "No record found for this commentId.";
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



router.post('/add-comment-like', function (req, res, next) {

    /*console.log("------>data 2= ", req.body);
    console.log("Email is ", req.body.email);
    console.log("reqQuery - >", req.query);
    res.send(req.body.email);*/
    var collection = new comment({
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

            /*Push into status array*/

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
