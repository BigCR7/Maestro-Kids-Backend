var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var studentSchema = new Schema({
  firstname: String,
  lastname: String,
  language: String,
  country: String,
  schoolname: String,
  avatar: String,
  isactive: Boolean,
  isdeleted: Boolean,
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

studentSchema.plugin(autoIncrement.plugin, 'data_students');
studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_students', studentSchema);