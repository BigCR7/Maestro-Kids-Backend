var AccountSchema = require('../schemas/account_schema.js');
var ProfileSchema = require('../schemas/profile_schema.js');
var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

module.exports.register = async function (req, res) {
 
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        var userInfo = {
            email :     req.body.email || null,
            password:   hash,
            profiletype:   req.body.profiletype,
            isactive: req.body.profiletype == 'Teacher' ? false : true,
            isdeleted: false,
            isapproved: false,
            token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        }

        var accountDoc = await AccountSchema.findOne({'email': userInfo.email});
        if (accountDoc == null) {
            accountDoc = await AccountSchema.create(userInfo);

            var profileInfo = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                language: req.body.language,
                country: req.body.country,
                schoolname: req.body.schoolname,
                accountid: accountDoc._id 
            }
            profileDoc = await ProfileSchema.create(profileInfo);

            var token=accountDoc.generateJwt();
            res.status(201).json({success: true, decodedToken: accountDoc, access_token: token, profile: profileDoc});
        } else {
            console.log("User is alread exist");
            res.status(201).json({success: false, error: "User is already exist"});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.change_password = async function (req, res) {
 
    try {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);

        var accountDoc = null;
        if (req.body.type == 'admin') {
            accountDoc = await AccountSchema.findOne({'profiletype': 'admin'});
        }
        else {
            accountDoc = await AccountSchema.findOne({'email': req.body.email});
        }

        if (accountDoc && !bcrypt.compareSync(req.body.oldpassword, accountDoc.password)) {
            res.status(401).json({success: false, message: 'Password is wrong.'});
        }
        else {
            accountDoc.password = hash;
            token = accountDoc.generateJwt();
            await AccountSchema.updateOne({email: req.body.email}, accountDoc);
            var profileDoc = await ProfileSchema.findOne({accountid: accountDoc._id});
            res.status(201).json({success: true, decodedToken: accountDoc, access_token: token, profile: profileDoc});    
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}

module.exports.sendSmsVerifyCode = function (req, res) {

    console.log("[Generate Sms verify code] => ");

    var expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 2);

    var code = "";
    var possible = "012345678987654321012345678909876543210";
  
    for (var i = 0; i < 5; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    var smsVerifyToken = jwt.sign({
        phoneNumber: req.body.phone,
        verifyCode: code,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.TOKENKEY);
    console.log("Phone Number : ", req.body.phone + " Verify Code: " + code);
    res.status(201).json({'verifyToken' : smsVerifyToken});
}

module.exports.smsVerifyTokenCheck = function (req, res) {
    var token = req.body.verifyToken;
    var code = req.body.code;
    if ( token && code) {
        jwt.verify(token, process.env.TOKENKEY, function(err, decoded) {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    console.log("Verifying Sms token => Token Expired");
                    res.status(401).json({"message": "Verifying Sms token => failed", "type": "token-exp"});
                } else {
                    console.log("Verifying Sms token => Faild");
                    res.status(401).json({"message": "Verifying Sms token => failed"});
                }
            } else {
                if (decoded.verifyCode == code) {
                    console.log("Phone " + decoded.phoneNumber + " => Sms verify Successed");
                    res.status(201).json({"success": true, "message" : "Sms Verify Successed."})
                } else {
                    console.log("Phone " + decoded.phoneNumber + " => Verify code doesn't match");
                    res.status(401).json({"success": false, "message": "Verify code doesn't match"});
                }
            }
        });
    }
}

module.exports.social_register = async function (req, res) {
 
    try {
        var userInfo = {
            email :     req.body.email || null,
            password:   'AAA',
            profiletype:   'Parent',
            isactive: true,
            isdeleted: false,
            isapproved: true,
            token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            socialmediastuff: req.body.socialmediastuff
        }

        var accountDoc = await AccountSchema.findOne({'email': userInfo.email});
        if (accountDoc == null) {
            accountDoc = await AccountSchema.create(userInfo);

            var profileInfo = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                accountid: accountDoc._id 
            }
            profileDoc = await ProfileSchema.create(profileInfo);

            var token=accountDoc.generateJwt();
            res.status(201).json({success: true, decodedToken: accountDoc, access_token: token, profile: profileDoc});
        } else {
            console.log("User is alread exist");
            res.status(201).json({success: false, error: "User is already exist"});
        }
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
    
}