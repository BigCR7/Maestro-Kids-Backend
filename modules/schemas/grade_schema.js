var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var gradeSchema = new Schema({
  name: String,
  color: String,
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

gradeSchema.plugin(autoIncrement.plugin, 'base_grades');
gradeSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('base_grades', gradeSchema);