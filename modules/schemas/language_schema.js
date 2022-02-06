var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var languageSchema = new Schema({
  code: String,
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

languageSchema.plugin(autoIncrement.plugin, 'base_languages');
languageSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('base_languages', languageSchema);