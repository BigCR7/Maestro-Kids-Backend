var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var activityCommentSchema = new Schema({
  activityid: Number,
  accountid: Number,
  comments: String,
  rating: Number,
  like: Number,
  dislike: Number,
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

activityCommentSchema.plugin(autoIncrement.plugin, 'data_activity_comments');
activityCommentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_activity_comments', activityCommentSchema);