var express = require('express');
var router = express.Router();
var _country = require('./ctl_country.js');
var _grade = require('./ctl_grade.js');
var _language = require('./ctl_language.js');
var _subject = require('./ctl_subject.js');
var _pyconfig = require('./ctl_payment_config.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Base Time: ', Date.now());
  next();
});

router.get('/get-country', _country.get_country);

router.post('/add-country', _country.add_country);

router.post('/update-country', _country.update_country);

router.post('/remove-country', _country.remove_country);

router.get('/get-grade', _grade.get_grade);

router.post('/add-grade', _grade.add_grade);

router.post('/update-grade', _grade.update_grade);

router.post('/remove-grade', _grade.remove_grade);

router.get('/get-language', _language.get_language);

router.post('/add-language', _language.add_language);

router.post('/update-language', _language.update_language);

router.post('/remove-language', _language.remove_language);

router.get('/get-subject', _subject.get_subject);

router.post('/add-subject', _subject.add_subject);

router.post('/update-subject', _subject.update_subject);

router.post('/remove-subject', _subject.remove_subject);

router.get('/get-payment-config', _pyconfig.get_payment_config);

router.post('/add-payment-config', _pyconfig.add_payment_config);

router.post('/update-payment-config', _pyconfig.update_payment_config);

router.post('/remove-payment-config', _pyconfig.remove_payment_config);

module.exports = router;