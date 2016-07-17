var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	text: {type: String},
	status_id: {type: Schema.Types.ObjectId, ref: 'Status'},
	user_id: {type: Schema.Types.ObjectId, ref: 'Users'}
});

module.exports = mongoose.model('Comments', CommentSchema);