var ConnectRoles = require('connect-roles');

var User = new ConnectRoles();

//anonymous users
//returning false stops any more rules from being 
//considered 
User.use(function(req, action) {
    if (!req.isAuthenticated()) return action === 'access home page';
});
 
//moderator users can access private page, but 
//they might not be the only ones so we don't return 
//false if the user isn't a moderator 
User.use('access private page',
    function(req) {
        if (req.user.role === 'moderator') {
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