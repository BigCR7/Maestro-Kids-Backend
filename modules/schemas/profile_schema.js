var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var profileSchema = new Schema({
  firstname: String,
  lastname: String,
  language: String,
  country: String,
  schoolname: String,
  accountid: Number,
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

profileSchema.plugin(autoIncrement.plugin, 'data_profiles');
profileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_profiles', profileSchema);