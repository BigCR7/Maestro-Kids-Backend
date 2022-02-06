var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;
var jwt = require('jsonwebtoken');

autoIncrement.initialize(mongoose.connection);

var accountSchema = new Schema({
  email: { 
    type: String,
    required: true
  },
  password: {
    type: String,
    required : true
  },
  isactive: Boolean,
  isdeleted: Boolean,
  isapproved: Boolean,
  profiletype: String,
  token: String,
  socialmediastuff: String,
  avatar: String,
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

accountSchema.plugin(autoIncrement.plugin, 'data_accounts');
accountSchema.plugin(passportLocalMongoose);

accountSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setHours(expiry.getHours() + 1);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    isactive: this.isactive,
    isdeleted: this.isdeleted,
    isapproved: this.isapproved,
    profiletype: this.profiletype,
    avatar: this.avatar,
    token: this.token,
    socialmediastuff: this.socialmediastuff,
    modified_at: this.modified_at,
    created_at: this.created_at,
    exp: parseInt(expiry.getTime() / 1000),
  }, this.token);
};

module.exports = mongoose.model('data_accounts', accountSchema);