var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReportSchema = new Schema({
    alleged_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    description: { type: String },
    report_type: { type: String }
});

module.exports = mongoose.model('Report', ReportSchema);