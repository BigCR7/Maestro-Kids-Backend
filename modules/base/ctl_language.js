var LanguageSchema = require('../schemas/language_schema.js');

module.exports.get_language = async function (req, res) {
    try {
        var languageDocs = await LanguageSchema.find({}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: languageDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_language = async function (req, res) {
    try {
        var doc = await LanguageSchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_language = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await LanguageSchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_language = async function (req, res) {
    try {
        await LanguageSchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
