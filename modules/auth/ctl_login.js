var ProfileSchema = require('../schemas/profile_schema.js');
var AccountSchema = require('../schemas/account_schema.js');
var passport = require('passport');
var jwtDecode = require('jwt-decode');
var jwt = require('jsonwebtoken');


module.exports.login = async function (req, res) {
  passport.authenticate('local', async function(err, user, info){
    var token;

    if (err) {
      console.log("passport error exception");
      res.status(401).json(err);
      return;
    }

    if(user){

      token = user.generateJwt();
      var decodedToken = jwtDecode(token);

      profileDoc = await ProfileSchema.findOne({accountid: decodedToken._id});

      res.status(201);
      res.json({
        'access_token' : token,
        'decodedToken' : decodedToken,
        'profile': profileDoc
      });

    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

}

module.exports.access_token = async function (req, res) {
  try {
    var token = req.body.access_token;
    var decodedToken = jwtDecode(token);
    // console.log(token);
    if(token){
        jwt.verify(token, decodedToken.token, async function(err, decoded) {
            // console.log(decoded);
            if(err){
                if (err.name === "TokenExpiredError") {
                    // console.log("Verifying auth token => Token Expired");
                    res.status(401).json({"message": "Verifying auth token => failed", "type": "token-exp"});
                } else {
                    // console.log("Verifying auth token => Faild");
                    res.status(401).json({"message": "Verifying auth token => failed"});
                }
            }else{
                // console.log("Verifying auth token => Success");
                profileDoc = await ProfileSchema.findOne({accountid: decodedToken._id});

                res.status(201);
                res.json({
                  'access_token' : token,
                  'decodedToken' : decodedToken,
                  'profile': profileDoc
                });
            }
        });
    }else{
      // console.log("Request hasn't got Auth token");
      res.status(403).json({"message": "failed"});
    }
  } catch(err) {
    console.log(err);
  }
}

module.exports.social_callback = async function (req, res) {
  try {
    var token;
    if(req.user){
      token = req.user.generateJwt();
      var decodedToken = jwtDecode(token);
      profileDoc = await ProfileSchema.findOne({accountid: decodedToken._id});

      console.log("social login success");
      res.status(201);
      res.json({
        'access_token' : token,
        'decodedToken' : decodedToken,
        'profile': profileDoc
      });
    } else {
      console.log(req.info);
      res.status(401).json(req.info);
    }    
  } catch (error) {
    console.log(err);
    res.status(401).json(err);
  }
}
