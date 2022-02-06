var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var countrySchema = new Schema({
  code: String,
  country: String,
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

countrySchema.plugin(autoIncrement.plugin, 'base_countries');
countrySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('base_countries', countrySchema);