var express = require('express');
var router = express.Router();
var Report = require('../model/report');
var meta = { code: Number, data_property_name: String, error: String };
var finalData = {};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

//localhost:3000/api/report/create
router.post('/create', function (req, res, next) {

    var collection = new Report({
        alleged_id: req.body.alleged_id,
        report_type: req.body.report_type,
        description: req.body.description
    });

    collection.save(function (error, result) {
        if (error) {
            console.log("Getting ERROR in reports/create API.", error);

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
            console.log("Report saved successfully!");
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

//localhost:3000/api/report/retrieve
router.get('/retrieve', function (req, res, next) {
    Report.find({})
    .populate('alleged_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in report/retrieve.", error);
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

//localhost:3000/api/report/retrieve/:reportId
router.get('/retrieve/:reportId', function (req, res, next) {
    Report.findOne({ _id: req.params.reportId })
    .populate('alleged_id')
    .exec(function (error, result) {
        if (error) {
            console.log("> Getting Error in report/retrieve/:reportId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this reportId.";
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


//localhost:3000/api/report/update/:reportId
router.put('/update/:reportId', function (req, res, next) {
    Report.update({ '_id': req.params.reportId }, req.body, { safe: true }, function (error, result) {
        if (error) {
            console.log("> Getting Error in report/update/:reportId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this reportId.";
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
//localhost:3000/api/report/delete/:statusId
router.delete('/delete/:reportId', function (req, res, next) {
    Report.remove({ _id: req.params.reportId }, function (error, result) {
        if (error) {
            console.log("> Getting Error in report/delete/:reportId.", error);
            meta.code = 404;
            meta.error = "Error: " + error;
            meta.data_property_name = "";
            FinalData = "No record found for this reportId.";
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
