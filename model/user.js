var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: 'Email for user is required!',
        trim: true,
        require: true
    },
    name: { type: String },
    username: { type: String, unique: true, require: true },
    website: { type: String, unique: true },
    bio: { type: String },
    phone_number: { type: Number },
    gender: { type: String },
    profile_pic:
	{
	    data: { type: Buffer },
	    contentType: { type: String }
	},
    password: {
        type: String,
        //required: 'Password for user is required!',
        //require: true,
        trim: true
    },
    role: {
        type: String,
        required: 'Role is required!',
        require: true,
        trim: true
    }
});

UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Users', UserSchema);