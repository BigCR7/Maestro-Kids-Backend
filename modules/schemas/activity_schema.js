var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var activitySchema = new Schema({
  activity_seg: String,
  title: String,
  activity_name: String,
  description: String,
  tags: Array,
  subjectid: Number,
  gradeid: Number,
  country: String,
  language: String,
  activity_type: String, // Public, Private, Paid
  isactive: {
    type: Boolean,
    default: true,
  },
  type: String,
  bgimage_url: String,
  store_result: {
    type: Boolean,
    default: true
  },
  activity_params: {
    type: String,
    default: "{}"
  },
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

activitySchema.plugin(autoIncrement.plugin, 'data_activities');
activitySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_activities', activitySchema);