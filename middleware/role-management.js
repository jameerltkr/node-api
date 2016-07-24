var ConnectRoles = require('connect-roles');

var User = new ConnectRoles();

//anonymous users
//returning false stops any more rules from being 
//considered 
User.use(function (req, action) {
    if (!req.isAuthenticated()) return action === 'register';
});

// Allow any Logged In User to Access Create API
User.use(function (req, action) {
    if (req.isAuthenticated()) return action === 'create';
});

//moderator users can access private page, but 
//they might not be the only ones so we don't return 
//false if the user isn't a moderator 
User.use('access moderator api',
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


// Allow Retrieve All to Owner, Moderator and Admin
User.use('access all', '/retrieve', function (req) {
    if (req.user.role == 'owner' || req.user.role == 'admin' || req.user.role === 'moderator') {
        return true;
    }
});

// Allow Retrieve User to Owner, Moderator, Admin and themselves
User.use('retrieve user', '/retrieve/:userId', function (req) {
    if (req.user.role == 'owner' || req.user.role == 'admin' || req.user.role === 'moderator' || req.params.userId == req.user._id) {
        return true;
    }
});

// Allow Update User to Owner, Moderator, Admin and themselves
User.use('update user', '/update/:userId', function (req) {
    if (req.user.role == 'owner' || req.user.role == 'admin' || req.user.role === 'moderator' || req.params.userId == req.user._id) {
        return true;
    }
});

// Allow Delete User to Owner, Admin and themselves
User.use('delete user', '/delete/:userId', function (req) {
    if (req.user.role == 'owner' || req.user.role == 'admin' || req.params.userId == req.user._id) {
        return true;
    }
});

// Allow Retrieve of Comments, Likes Etc to Owner, Moderator, Admin and themselves
User.use('retrieve', '/retrieve-by-user/:userId', function (req) {
    if (req.user.role == 'owner' || req.user.role == 'admin' || req.user.role === 'moderator' || req.params.userId == req.user._id) {
        return true;
    }
});

// Allow Admin to access all pages 
User.use(function (req) {
    if (req.user.role === 'admin') {
        return true;
    }
});

module.exports = User;