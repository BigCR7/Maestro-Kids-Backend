var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var contactMailSchema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  message: String,
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

contactMailSchema.plugin(autoIncrement.plugin, 'data_contact_mails');
contactMailSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_contact_mails', contactMailSchema);