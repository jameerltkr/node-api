var express = require('express');
var router = express.Router();
var report = require('../model/report');
var meta  = { code : Number , data_property_name : String, error : String };
var finalData = {};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add', function(req, res, next){

  /*console.log("------>data 2= ", req.body);
  console.log("Email is ", req.body.email);
  console.log("reqQuery - >", req.query);
  res.send(req.body.email);*/
  var collection = new report({
    alleged_id: req.body.alleged_id, 
	type: req.body.type, 
	description: req.body.description	
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
      console.log("Report saved successfully!");
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
