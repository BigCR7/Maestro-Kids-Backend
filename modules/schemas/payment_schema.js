var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

autoIncrement.initialize(mongoose.connection);

var paymentSchema = new Schema({
  profileid: Number,
  paid_date: {
    type: Date,
    default: Date.now
  },
  amount: Number,
  for_month_start: {
    type: Boolean,
    default: false
  },
  for_month_end: {
    type: Boolean,
    default: false
  },
  isdonation: Boolean,
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

paymentSchema.plugin(autoIncrement.plugin, 'data_payments');
paymentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('data_payments', paymentSchema);