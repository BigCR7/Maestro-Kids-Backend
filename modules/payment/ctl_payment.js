var PaymentSchema = require('../schemas/payment_schema');
var AccountSchema = require('../schemas/account_schema.js');
var ProfileSchema = require('../schemas/profile_schema.js');
var multilingual = require('../init/multilingual.js');
const nodemailer = require('nodemailer');

module.exports.add_new_payment = async function (req, res) {
    try {
        var doc = await PaymentSchema.create(req.body.row);
        var profile = await ProfileSchema.findOne({_id: req.body.row.profileid});
        var accountDoc = await AccountSchema.findOne({_id: profile.accountid});

        var lang = (profile.language == undefined || profile.language == null) ? "en" : profile.language;

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
                to: accountDoc.email, // Recepient email address. Multiple emails can send separated by commas
                subject: multilingual.multilingual[lang]["donate_subject"],
                text: multilingual.multilingual[lang]["donate_text1"] + req.body.row.amount + multilingual.multilingual[lang]["donate_text2"]
            };
         
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  res.status(401).json({"message": "Failed to send email."});
                }
                else {
                  console.log('Message sent: %s', info.messageId);
                  res.status(201).json({"message": "Email sent."});  
                }
            });
        });
      
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
