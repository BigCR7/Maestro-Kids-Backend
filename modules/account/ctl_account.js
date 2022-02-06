var AccountSchema = require('../schemas/account_schema.js');
var ProfileSchema = require('../schemas/profile_schema.js');
var bcrypt = require('bcryptjs');

var resources = {
    _id: "$_id",
    email: {"$first":"$email"},
    profiletype: {"$first":"$profiletype"},
    isactive: {"$first":"$isactive"},
    isdeleted: {"$first":"$isdeleted"},
    isapproved: {"$first":"$isapproved"},
    socialmediastuff: {"$first":"$socialmediastuff"},
    avatar: {"$first":"$avatar"},
};

module.exports.get_accounts = async function (req, res) {
    try {
        var docs = await AccountSchema.aggregate([{
            $group: resources
        }, {
            $lookup: {
                from: "data_profiles", // collection to join
                localField: "_id",//field from the input documents
                foreignField: "accountid",//field from the documents of the "from" collection
                as: "profile"// output array field
            }
        }]);
        var resDoc = [];
        docs.forEach((doc) => {
            if ((req.body.account_status == 'Active' && doc.isactive == true) ||
                (req.body.account_status == 'Inactive' && doc.isactive == false) ||
                (req.body.account_status == 'Closed' && doc.isdeleted == true) ||
                (req.body.account_status == 'Unapproved' && doc.isapproved == false) ||
                (req.body.account_status == 'All')
            ) {
                resDoc.push({
                    ...doc,
                    firstname: doc.profile[0].firstname,
                    lastname: doc.profile[0].lastname,
                    schoolname: doc.profile[0].schoolname,
                    country: doc.profile[0].country,
                    language: doc.profile[0].language
                });
            }
        })
        res.status(201).json({success: true, doc: resDoc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}

module.exports.add_account = async function (req, res) {
    try {
        var newAccount = req.body.newAccount;
        var accountDoc = await AccountSchema.findOne({email: newAccount.email});
        if (accountDoc == null) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(process.env.INITPW, salt);
    
            var userInfo = {
                email :     newAccount.email,
                password:   hash,
                profiletype:   newAccount.profiletype,
                isactive: newAccount.isactive,
                isdeleted: newAccount.isdeleted,
                isapproved: newAccount.isapproved,
                socialmediastuff: newAccount.socialmediastuff,
                token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                avatar: newAccount.avatar
            }

            accountDoc = await AccountSchema.create(userInfo);

            var profileInfo = {
                firstname: newAccount.firstname,
                lastname: newAccount.lastname,
                schoolname: newAccount.schoolname,
                country: newAccount.country,
                language: newAccount.language,
                accountid: accountDoc._id
            }

            await ProfileSchema.create(profileInfo);

            res.status(201).json({success: true});
        }
        else {
            res.status(401).json({success: false, message: "Same email already exist."});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}

module.exports.update_account = async function (req, res) {
    try {
        var newAccount = req.body.user;
        var accountDoc = await AccountSchema.findOne({_id: newAccount._id});
        if (accountDoc != null) {
            var userInfo = {
                email :     newAccount.email,
                password:   accountDoc.password,
                profiletype:   newAccount.profiletype,
                isactive: newAccount.isactive,
                isdeleted: newAccount.isdeleted,
                isapproved: newAccount.isapproved,
                socialmediastuff: newAccount.socialmediastuff,
                token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                avatar: newAccount.avatar
            }

            accountDoc = await AccountSchema.updateOne({_id: newAccount._id}, userInfo);

            var profileInfo = {
                firstname: newAccount.firstname,
                lastname: newAccount.lastname,
                schoolname: newAccount.schoolname,
                country: newAccount.country,
                language: newAccount.language,
                accountid: newAccount._id
            }

            await ProfileSchema.updateOne({accountid: newAccount._id}, profileInfo);

            res.status(201).json({success: true});
        }
        else {
            res.status(401).json({success: false, message: "Email does not exist."});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}

module.exports.remove_account = async function (req, res) {
    try {
        await AccountSchema.deleteOne({_id: req.body.accountId});
        await ProfileSchema.deleteOne({accountid: req.body.accountId});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error, doc: []});
    }
}
