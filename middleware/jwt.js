var Jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var Config = require('../bin/config');

var GenerateToken = function (user) {
    // create a token
    var token = Jwt.sign(user, Config.secret, {
        expiresIn: 60 * 60 * 24 // expires in 24 hours
    });

    return token;
}

// route middleware to verify a token
var Auth = function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        Jwt.verify(token, Config.secret, function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes

				// get the decoded payload and header
				var decoded = Jwt.decode(token, {complete: true});
				var user = decoded.payload._doc;	// Get the user from JWT Token
				
				req.login(user, function (errr) {
					if(errr){
						return res.json({ success: false, message: 'Failed to authenticate user.' });
					}else{				
						req.decoded = decoded;
						next();
					}
				});	// Log In the user using Passport Authentication
				
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
};

module.exports = {
    GenerateToken: GenerateToken,
    Auth: Auth
};