var PaymentConfigSchema = require('../schemas/payment_config_schema.js');

module.exports.get_payment_config = async function (req, res) {
    try {
        var doc = await PaymentConfigSchema.find({}, {}, {sort: {_id: 1}});
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_payment_config = async function (req, res) {
    try {
        var doc = await PaymentConfigSchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_payment_config = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await PaymentConfigSchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_payment_config = async function (req, res) {
    try {
        await PaymentConfigSchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
