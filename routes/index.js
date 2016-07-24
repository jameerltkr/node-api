var express = require('express');
var router = express.Router();

var MiddlewareJwt = require('../middleware/jwt');
var roleUser = require('../middleware/role-management');

/* GET home page. */
router.get('/', roleUser.can('access home api'), function (req, res, next) {

    res.send('test');
});

/* GET home page. */
router.get('/test', MiddlewareJwt.Auth, function (req, res, next) {
    console.log(req.isAuthenticated());
    res.send('test');
});

router.get('/private', roleUser.can('access private api'), function (req, res, next) {
    console.log(req.user.role);
    res.send('test');
});

router.get('/admin', roleUser.can('access admin api'), function (req, res, next) {
    console.log(req.user.role);
    res.send('test');
});

module.exports = router;
