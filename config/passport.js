var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var AccountSchema = require('../modules/schemas/account_schema.js');
var bcrypt = require('bcryptjs');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(email, password, done) {
    console.log(email + ':' + password);
    AccountSchema.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User or password wrong!'
        });
      }
      // Return if password is wrong
      if (user && password !== process.env.INITPW && !bcrypt.compareSync(password, user.password)) {
        return done(null, false, {
          message: 'Password is wrong!'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.LIVEURL + 'auth/callback/facebook'
  },
  function(accessToken, refreshToken, profile, cb) {
    AccountSchema.findOne({ email: profile.email, socialmediastuff: 'facebook' }, function (err, user) {
      if (err) { return cb(err); }
      // Return if user not found in database
      if (!user) {
        return cb(null, false, {
          message: 'Account does not exist!'
        });
      }
      // If credentials are correct, return the user object
      return cb(null, user);
    });
  }
));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.LIVEURL + 'auth/callback/google',
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    AccountSchema.findOne({ email: profile.email, socialmediastuff: 'google' }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'Account does not exist!'
        });
      }
      console.log(user);
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.LIVEURL + 'auth/callback/twitter'
  },
  function(token, tokenSecret, profile, cb) {
    AccountSchema.findOne({ email: profile.email, socialmediastuff: 'twitter' }, function (err, user) {
      if (err) { return cb(err); }
      // Return if user not found in database
      if (!user) {
        return cb(null, false, {
          message: 'Account does not exist!'
        });
      }
      // If credentials are correct, return the user object
      return cb(null, user);
    });
  }
));