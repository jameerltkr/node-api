var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentLikeSchema = new Schema({
    comment_id: { type: Schema.Types.ObjectId, ref: 'Comments' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' }
});

module.exports = mongoose.model('CommentLike', CommentLikeSchema);