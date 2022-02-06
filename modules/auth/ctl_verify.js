var AccountSchema = require('../schemas/account_schema.js');
var ProfileSchema = require('../schemas/profile_schema.js');
var ContactMailSchema = require('../schemas/contact_mail_schema.js');
var jwtDecode = require('jwt-decode');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var multilingual = require('../init/multilingual');

const nodemailer = require('nodemailer');

module.exports.send_v_email = async function (req, res) {
  try {
    var email = req.body.email;
    var accountDoc = await AccountSchema.findOne({ email });
    var profileDoc = await ProfileSchema.findOne({accountid: accountDoc._id});
    var token = accountDoc.generateJwt();

    console.log(token)

    var lang = (profileDoc.language == undefined || profileDoc.language == null) ? "en" : profileDoc.language;

    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
          host: process.env.MAILER_HOST, // Gmail Host
          port: process.env.MAILER_PORT, // Port
          secure: true, // this is true as port is 465
          auth: {
              user: process.env.GMAIL, //Gmail username
              pass: process.env.GMAILPW // Gmail password
          }
      });
   
      let mailOptions = {
          from: '"MAESTROKIDS ADMIN" <admin@maestrokids.net>',
          to: email, // Recepient email address. Multiple emails can send separated by commas
          subject: multilingual.multilingual[lang]["verify_subject"],
          text: multilingual.multilingual[lang]["verify_text"] + process.env.LIVEURL + 'verification/' + token
      };
   
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(403).json({"message": "failed"});
          }
          else {
            console.log('Message sent: %s', info.messageId);
            res.status(201).json({"message": "success"});
          }
      });
  });
  } catch(err) {
    console.log(err);
    res.status(403).json({"message": "failed"});
  }
}

module.exports.verify_email_token = async function (req, res) {
  try {
    var token = req.body.access_token;
    var decodedToken = jwtDecode(token);
    if(token){
        jwt.verify(token, decodedToken.token, async function(err, decoded) {
            if(err){
                if (err.name === "TokenExpiredError") {
                    console.log("Verifying auth token => Token Expired");
                    res.status(401).json({"message": "Verifying auth token => failed", "type": "token-exp"});
                } else {
                    console.log("Verifying auth token => Faild");
                    res.status(401).json({"message": "Verifying auth token => failed"});
                }
            }else{
                console.log("Verifying auth token => Success");
                var accountDoc = await AccountSchema.findOne({email: decodedToken.email});
                accountDoc.isapproved = true;
                await AccountSchema.updateOne({email: decodedToken.email}, accountDoc);
                token = accountDoc.generateJwt();

                profileDoc = await ProfileSchema.findOne({accountid: decodedToken._id});

                res.status(201);
                res.json({
                  'access_token' : token,
                  'decodedToken' : accountDoc,
                  'profile': profileDoc
                });
            }
        });
    }else{
      console.log("Request hasn't got Auth token");
      res.status(403).json({"message": "failed"});
    }
  } catch(err) {
    console.log(err);
    res.status(403).json({"message": "failed"});
  }
}

module.exports.send_pw_email = async function (req, res) {
  try {
    var email = req.body.email;
    var accountDoc = await AccountSchema.findOne({ email });
    var profileDoc = await ProfileSchema.findOne({accountid: accountDoc._id});
    var token = accountDoc.generateJwt();

    console.log(token)

    var lang = (profileDoc.language == undefined || profileDoc.language == null) ? "en" : profileDoc.language;

    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
          host: process.env.MAILER_HOST, // Gmail Host
          port: process.env.MAILER_PORT, // Port
          secure: true, // this is true as port is 465
          auth: {
              user: process.env.GMAIL, //Gmail username
              pass: process.env.GMAILPW // Gmail password
          }
      });
   
      let mailOptions = {
          from: '"MAESTROKIDS ADMIN" <admin@maestrokids.net>',
          to: email, // Recepient email address. Multiple emails can send separated by commas
          subject: multilingual.multilingual[lang]["verify_subject"],
          text: multilingual.multilingual[lang]["resetpw_text"] + process.env.LIVEURL + 'forgotpassword/' + token
      };
   
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(401).json({"message": "Failed to send reset email."});
          }
          else {
            console.log('Message sent: %s', info.messageId);
            res.status(201).json({"message": "Reset email sent."});  
          }
        });
  });
  } catch(err) {
    console.log(err);
    res.status(401).json({"message": "Failed to send reset email."});
  }
}

module.exports.set_forgotten_password = async function (req, res) {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);

    var token = req.body.access_token;
    if(token){
        jwt.verify(token, process.env.TOKENKEY, async function(err, decoded) {
            if(err){
                if (err.name === "TokenExpiredError") {
                    console.log("Verifying auth token => Token Expired");
                    res.status(401).json({"message": "Verifying auth token => failed", "type": "token-exp"});
                } else {
                    console.log("Verifying auth token => Faild");
                    res.status(401).json({"message": "Verifying auth token => failed"});
                }
            }else{
                console.log("Verifying auth token => Success");
                var decodedToken = jwtDecode(token);
                var accountDoc = await AccountSchema.findOne({email: decodedToken.email});
                accountDoc.password = hash;

                await AccountSchema.updateOne({email: decodedToken.email}, accountDoc);
                token = accountDoc.generateJwt();

                profileDoc = await ProfileSchema.findOne({accountid: decodedToken._id});

                res.status(201);
                res.json({
                  'access_token' : token,
                  'decodedToken' : accountDoc,
                  'profile': profileDoc
                });
            }
        });
    }else{
      console.log("Request hasn't got Auth token");
      res.status(403).json({"message": "failed"});
    }
  } catch(err) {
    console.log(err);
  }
}

module.exports.contact_message = async function (req, res) {
  try {
    var email = req.body.email;

    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport({
          host: process.env.MAILER_HOST, // Gmail Host
          port: process.env.MAILER_PORT, // Port
          secure: true, // this is true as port is 465
          auth: {
              user: process.env.GMAIL, //Gmail username
              pass: process.env.GMAILPW // Gmail password
          }
      });
   
      let mailOptions = {
          from: email,
          to: process.env.GMAIL, // Recepient email address. Multiple emails can send separated by commas
          subject: 'From ' + req.body.firstname + ' ' + req.body.lastname,
          text: req.body.message
      };
   
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.status(401).json({"message": "Failed to send contact email."});
          }
          else {
            console.log('Message sent: %s', info.messageId);
            ContactMailSchema.create({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              message: req.body.message
            });
            res.status(201).json({"message": "Contact email sent."});  
          }
        });
    });
  } catch(err) {
    console.log(err);
    res.status(401).json({"message": "Failed to send reset email."});
  }
}
