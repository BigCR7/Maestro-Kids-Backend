var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var studentSubjectSchema = new Schema({
  studentid: Number,
  subjectid: Number,
  isactive: Boolean,
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    default: Date.now
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

studentSubjectSchema.plugin(autoIncrement.plugin, 'data_student_subjects');
studentSubjectSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_student_subjects', studentSubjectSchema);