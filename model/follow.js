var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowSchema = new Schema({
    following_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    follower_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    is_follow_accepted: { type: Boolean }
});

module.exports = mongoose.model('Follow', FollowSchema);