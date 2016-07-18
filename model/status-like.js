var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusLikeSchema = new Schema({
    status_id: { type: Schema.Types.ObjectId, ref: 'Status' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' }
});

module.exports = mongoose.model('StatusLike', StatusLikeSchema);