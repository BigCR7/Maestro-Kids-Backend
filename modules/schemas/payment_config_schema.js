var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var paymentConfigSchema = new Schema({
  type: String,  // teacher or parent
  amount: Number,
  currency: String,
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

paymentConfigSchema.plugin(autoIncrement.plugin, 'base_payment_configs');
paymentConfigSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('base_payment_configs', paymentConfigSchema);