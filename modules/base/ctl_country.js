var CountrySchema = require('../schemas/country_schema.js');

module.exports.get_country = async function (req, res) {
    try {
        var countryDocs = await CountrySchema.find({}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: countryDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_country = async function (req, res) {
    try {
        var doc = await CountrySchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_country = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await CountrySchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_country = async function (req, res) {
    try {
        await CountrySchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
