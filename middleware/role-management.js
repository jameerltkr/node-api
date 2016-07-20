var ConnectRoles = require('connect-roles');

var User = new ConnectRoles();

//anonymous users
//returning false stops any more rules from being 
//considered 
User.use(function (req, action) {
    if (!req.isAuthenticated()) return action === 'register';
});


//moderator users can access private page, but 
//they might not be the only ones so we don't return 
//false if the user isn't a moderator 
User.use('access private api',
    function (req) {
        if (req.user.role === 'moderator') {
            return true;
        }
    });

User.use('access owner api',
    function (req) {
        if (req.user.role === 'owner') {
            return true;
        }
    });


User.use('access retrieve multiple data api',
    function (req) {
        if (req.user.role === 'owner' || req.user.role === 'admin') {
            return true;
        }
    });

User.use('access retrieve single data api',
    function (req) {
        console.log(req.user);
        if (req.user.role === 'owner' || req.user.role === 'admin') {
            return true;
        }
    });


//admin users can access all pages 
User.use(function (req) {
    if (req.user.role === 'admin') {
        return true;
    }
});

module.exports = User;