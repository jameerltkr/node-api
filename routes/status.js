var express = require('express');
var router = express.Router();
var Status = require('../model/status');
var meta = { code: Number, data_property_name: String, error: String };
var finalData = {};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/create', function (req, res, next) {

    var collection = new Status({
        text: req.body.text,
        likes: [req.body.likes],
        comments: [req.body.comments],
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
router.get('/retrieve', function(req, res, next){
    Status.find({}, function(error, result){
        if(error){
            console.log("> Getting Error in status/retrieve.",error);
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
//localhost:3000/api/status/retrieve/:statusId
router.get('/retrieve/:statusId', function(req, res, next){
    Status.findOne({_id: req.params.statusId}, function(error, result){
        if(error){
            console.log("> Getting Error in status/retrieve/:statusId.",error);
            Meta.code = 404;
            Meta.error = "Error: "+error;
            Meta.data_property_name = "";
            FinalData = "No record found for this statusId.";
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
//localhost:3000/api/status/delete/:statusId
router.delete('/delete/:statusId', function(req, res, next){
    Status.remove({_id: req.params.statusId}, function(error, result){
        if(error){
            console.log("> Getting Error in status/delete/:statusId.",error);
            Meta.code = 404;
            Meta.error = "Error: "+error;
            Meta.data_property_name = "";
            FinalData = "No record found for this statusId.";
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



router.post('/like/create', function (req, res, next) {

    var collection = new status({
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
            finalData = "";
        }
        else {

            /*push into statu table*/

            console.log("Status saved successfully!");
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
