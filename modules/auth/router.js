var express = require('express');
var router = express.Router();
var _login = require('./ctl_login.js');
var _register = require('./ctl_register.js');
var _verify = require('./ctl_verify.js');
var _profile = require('./ctl_profile.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Auth Time: ', Date.now());
  next();
});

// Login
router.post('/login', _login.login);

router.get('/callback/social-success', _login.social_callback);

// Access-token
router.post('/access-token', _login.access_token);

// Register
router.post('/register', _register.register);

router.post('/change-password', _register.change_password);

router.post('/social-register', _register.social_register);

// Send Sms Verify code
router.post('/verifySms', _register.sendSmsVerifyCode);

// Check Verify Code
router.post('/verifySmsCheck', _register.smsVerifyTokenCheck);

router.post('/send-v-email', _verify.send_v_email);

router.post('/verify-email-token', _verify.verify_email_token);

router.post('/send-pw-email', _verify.send_pw_email);

router.post('/set-forgotten-pw', _verify.set_forgotten_password);

router.post('/update-profile', _profile.update_profile);

router.post('/contact-message', _verify.contact_message);

module.exports = router;