var ActivityFileSchema = require('../schemas/activity_file_schema.js');

module.exports.get_activity_file = async function (req, res) {
    try {
        var activityDocs = await ActivityFileSchema.find({}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: activityDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.get_activity_files_by_id = async function (req, res) {
    try {
        var activityDocs = await ActivityFileSchema.find({activityid: req.body.activityid}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: activityDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_activity_file = async function (req, res) {
    try {
        var doc = await ActivityFileSchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_activity_file = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await ActivityFileSchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_activity_file = async function (req, res) {
    try {
        await ActivityFileSchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
