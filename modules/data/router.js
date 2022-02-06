var express = require('express');
var router = express.Router();
var _activity = require('./ctl_activity.js');
var _activity_file = require('./ctl_activity_file.js');
var _activity_comment = require('./ctl_activity_comment.js');

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Data Time: ', Date.now());
  next();
});

router.get('/get-activity', _activity.get_activity);

router.post('/get-filtered-activities', _activity.get_filtered_activity);

router.post('/add-activity', _activity.add_activity);

router.post('/update-activity', _activity.update_activity);

router.post('/remove-activity', _activity.remove_activity);

router.post('/update-activity-result', _activity.update_activity_result);

router.get('/get-activity-file', _activity_file.get_activity_file);

router.post('/add-activity-file', _activity_file.add_activity_file);

router.post('/update-activity-file', _activity_file.update_activity_file);

router.post('/remove-activity-file', _activity_file.remove_activity_file);

router.get('/get-activity-comment', _activity_comment.get_activity_comment);

router.post('/add-activity-comment', _activity_comment.add_activity_comment);

router.post('/update-activity-comment', _activity_comment.update_activity_comment);

router.post('/remove-activity-comment', _activity_comment.remove_activity_comment);

router.post('/get-activity-files-by-id', _activity_file.get_activity_files_by_id);

router.post('/get-activity-comments-by-id', _activity_comment.get_activity_comments_by_id);

router.post('/get-activity-param-json', _activity.get_activity_param_json);

router.post('/get-activity-result', _activity.get_activity_result);

router.post('/get-activity-result-by-user', _activity.get_activity_result_by_user);

module.exports = router;