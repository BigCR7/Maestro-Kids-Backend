var AccountSchema = require('../schemas/account_schema.js');
var ProfileSchema = require('../schemas/profile_schema.js');

module.exports.update_profile = async function (req, res) {
 
    try {
        var accountDoc = await AccountSchema.findOne({'email': req.body.email});
        var profileDoc = await ProfileSchema.findOne({accountid: accountDoc._id});

        accountDoc.profiletype = req.body.profiletype;
        accountDoc.avatar = req.body.avatar;
        profileDoc.firstname = req.body.firstname;
        profileDoc.lastname = req.body.lastname;
        profileDoc.schoolname = req.body.schoolname;
        profileDoc.country = req.body.country;
        profileDoc.language = req.body.language;
        profileDoc.modified_at = Date.now();

        await AccountSchema.updateOne({'email': req.body.email}, accountDoc);
        await ProfileSchema.updateOne({accountid: accountDoc._id}, profileDoc);

        var token=accountDoc.generateJwt();
        res.status(201).json({success: true, decodedToken: accountDoc, access_token: token, profile: profileDoc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}
