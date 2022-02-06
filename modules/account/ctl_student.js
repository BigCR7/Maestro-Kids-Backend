var StudentSchema = require('../schemas/student_schema.js');

module.exports.get_students = async function (req, res) {
    try {
        var docs = await StudentSchema.find();
        var resDoc = [];
        docs.forEach((doc) => {
            if ((req.body.account_status == 'Active' && doc.isactive == true) ||
                (req.body.account_status == 'Inactive' && doc.isactive == false) ||
                (req.body.account_status == 'Closed' && doc.isdeleted == true) ||
                (req.body.account_status == 'All')
            ) {
                resDoc.push(doc);
            }
        })
        res.status(201).json({success: true, doc: resDoc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}

module.exports.add_student = async function (req, res) {
    try {
        var newAccount = req.body.newAccount;
        accountDoc = await StudentSchema.create(newAccount);

        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}

module.exports.update_student = async function (req, res) {
    try {
        var newAccount = req.body.user;
        newAccount.modified_at = Date.now();
        accountDoc = await StudentSchema.updateOne({_id: newAccount._id}, newAccount);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}

module.exports.remove_student = async function (req, res) {
    try {
        await StudentSchema.deleteOne({_id: req.body.accountId});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}
