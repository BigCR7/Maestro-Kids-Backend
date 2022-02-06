var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var activityResultSchema = new Schema({
  studentid: Number,
  activityid: Number,
  start_time: {
    type: Date,
    default: Date.now
  },
  end_time: {
    type: Date,
    default: Date.now
  },
  questions: Number,
  correct_answers: Number,
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

activityResultSchema.plugin(autoIncrement.plugin, 'data_activity_results');
activityResultSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_activity_results', activityResultSchema);