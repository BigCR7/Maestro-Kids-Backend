var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var activityFileSchema = new Schema({
  activityid: Number,
  url_json_file: String,
  language: String,
  modified_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
},{
  usePushEach : true
});

activityFileSchema.plugin(autoIncrement.plugin, 'data_activity_files');
activityFileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_activity_files', activityFileSchema);