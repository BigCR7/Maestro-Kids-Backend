var ActivitySchema = require('../schemas/activity_schema.js');
var ActivityResultSchema = require('../schemas/activity_result_schema.js');
var axios = require('axios');

module.exports.get_activity = async function (req, res) {
    try {
        var activityDocs = await ActivitySchema.find({}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: activityDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_activity = async function (req, res) {
    try {
        var doc = await ActivitySchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_activity = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await ActivitySchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_activity = async function (req, res) {
    try {
        await ActivitySchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.get_filtered_activity = async function (req, res) {
    try {
        var activityDocs = await ActivitySchema.find({}, {}, {sort: {_id: 1}});
        var resDoc = [];
        activityDocs.map((cur) => {
            if ((req.body.search.length == 0 || cur.toString().indexOf(req.body.search) >= 0) && 
                (req.body.filter_subject.length == 0 || req.body.filter_subject.indexOf(cur.subjectid) >= 0) &&
                (req.body.filter_grade.length == 0 || req.body.filter_grade.indexOf(cur.gradeid) >= 0) &&
                (req.body.filter_language.length == 0 || req.body.filter_language.indexOf(cur.language) >= 0)
            ) {
                resDoc.push(cur);
            }
        })

        var rowsPerPage = req.body.rowsPerPage;
        var page = req.body.page;

        res.status(201).json({
            success: true, 
            doc: resDoc.slice(rowsPerPage === -1 ? 0 : page * rowsPerPage, rowsPerPage === -1 ? resDoc.length : (page + 1) * rowsPerPage), 
            count: resDoc.length});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_activity_result = async function (req, res) {
    try {
        var resultDoc = await ActivityResultSchema.findOne({studentid: req.body.studentid, activityid: req.body.activityid, start_time: req.body.start_time});
        if (resultDoc == null) {
            await ActivityResultSchema.create({
                studentid: req.body.studentid,
                activityid: req.body.activityid,
                start_time: req.body.start_time,
                questions: req.body.questions,
                correct_answers: req.body.correct_answers
            });
        }
        else {
            resultDoc.end_time = new Date();
            resultDoc.questions = req.body.questions;
            resultDoc.correct_answers = req.body.correct_answers;
            await ActivityResultSchema.updateOne({studentid: req.body.studentid, activityid: req.body.activityid}, resultDoc);
        }
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.get_activity_result = async function (req, res) {
    try {
        var resultDoc = await ActivityResultSchema.find({studentid: req.body.studentid, activityid: req.body.activityid});
        res.status(201).json({success: true, doc: resultDoc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

var resources = {
    _id: "$_id",
    studentid: {"$first":"$studentid"},
    activityid: {"$first":"$activityid"},
    start_time: {"$first":"$start_time"},
    end_time: {"$first":"$end_time"},
    questions: {"$first":"$questions"},
    correct_answers: {"$first":"$correct_answers"}
};

module.exports.get_activity_result_by_user = async function (req, res) {
    try {
        var docs = await ActivityResultSchema.aggregate([{
            $group: resources
        }, {
            $lookup: {
                from: "data_activities", 
                localField: "activityid",
                foreignField: "_id",
                as: "activity"
            }
        }]);
        var resDoc = [];
        docs.forEach((doc) => {
            if (req.body.studentid == doc.studentid) {
                resDoc.push({
                    ...doc,
                    activity_name: doc.activity[0].activity_name
                });
            }
        })

        res.status(201).json({success: true, doc: resDoc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.get_activity_param_json = async function (req, res) {
    try {
        var response = await axios.get(req.body.url, {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials":true,
              "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            },
            responseType: "json"
        });
        res.status(201).json({success: true, doc: response.data});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
