var express = require('express');
var router = express.Router();
var _payment = require('./ctl_payment.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Payment Time: ', Date.now());
  next();
});

router.post('/add-new-payment', _payment.add_new_payment);

module.exports = router;