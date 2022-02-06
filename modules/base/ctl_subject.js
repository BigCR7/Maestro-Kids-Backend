var SubjectSchema = require('../schemas/subject_schema.js');

module.exports.get_subject = async function (req, res) {
    try {
        var subjectDocs = await SubjectSchema.find({}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: subjectDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_subject = async function (req, res) {
    try {
        var doc = await SubjectSchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_subject = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await SubjectSchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_subject = async function (req, res) {
    try {
        await SubjectSchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
