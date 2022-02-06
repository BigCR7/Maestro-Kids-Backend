var express = require('express');
var router = express.Router();
var _account = require('./ctl_account.js');
var _student = require('./ctl_student.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Account Time: ', Date.now());
  next();
});

router.post('/get-accounts', _account.get_accounts);

router.post('/add-account', _account.add_account);

router.post('/update-account', _account.update_account);

router.post('/remove-account', _account.remove_account);

router.post('/get-student', _student.get_students);

router.post('/add-student', _student.add_student);

router.post('/update-student', _student.update_student);

router.post('/remove-student', _student.remove_student);

module.exports = router;