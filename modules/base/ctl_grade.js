var GradeSchema = require('../schemas/grade_schema.js');

module.exports.get_grade = async function (req, res) {
    try {
        var countryDocs = await GradeSchema.find({}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: countryDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_grade = async function (req, res) {
    try {
        var doc = await GradeSchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_grade = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await GradeSchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_grade = async function (req, res) {
    try {
        await GradeSchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
