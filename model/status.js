var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusSchema = new Schema({
    text: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'StatusLike' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' }
});

module.exports = mongoose.model('Status', StatusSchema);