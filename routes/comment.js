var express = require('express');
var router = express.Router();
var comment = require('../model/comment');
var commentLike = require('../model/comment-like');
var meta  = { code : Number , data_property_name : String, error : String };
var finalData = {};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add-comment', function(req, res, next){

  /*console.log("------>data 2= ", req.body);
  console.log("Email is ", req.body.email);
  console.log("reqQuery - >", req.query);
  res.send(req.body.email);*/
  var collection = new comment({
    text: req.body.text,
	status_id: req.body.status_id,
	user_id: req.body.user_id
  });

  collection.save(function (error, result){
    if(error){
      console.log("Getting ERROR in reports/add API.", error);

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
    	/*Push into status array*/
      console.log("Comment saved successfully!");
      meta.code = 200;
      meta.data_property_name = "data";
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

router.post('/add-comment-like', function(req, res, next){

  /*console.log("------>data 2= ", req.body);
  console.log("Email is ", req.body.email);
  console.log("reqQuery - >", req.query);
  res.send(req.body.email);*/
  var collection = new comment({
    comment_id: req.body.comment_id,
	user_id: req.body.user_id
  });

  collection.save(function (error, result){
    if(error){
      console.log("Getting ERROR in reports/add API.", error);

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

    	/*Push into status array*/
      
      console.log("Comment-like saved successfully!");
      meta.code = 200;
      meta.data_property_name = "data";
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

module.exports = router;
