const express = require('express');
const path = require('path');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const Account = require('./modules/account/router.js');
const Auth = require('./modules/auth/router.js');
const Base = require('./modules/base/router.js');
const Data = require('./modules/data/router.js');
const Payment = require('./modules/payment/router.js');

require('./config/db_connection.js');
require('./config/passport.js');

var fs = require('fs');
var AWS = require('aws-sdk');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
const multer = require("multer");
const app = express();

app.use(cors())

var cookieParser = require('cookie-parser');

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(cookieParser());

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json 
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

require('./modules/init/init_db.js');

app.use('/account', Account);
app.use('/auth', Auth);
app.use('/base', Base);
app.use('/data', Data);
app.use('/payment', Payment);

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY,
    region: process.env.AWS_REGION
});

app.get('/facebook-login',
  passport.authenticate('facebook'));

app.get('/auth/callback/facebook',
    passport.authenticate('facebook', { 
        successRedirect: '/auth/callback/social-success',
        failureRedirect: '/auth/login'
    })
);

app.get('/google-login', passport.authenticate('google', { scope: [
    'email', 'profile'] 
}));
 
app.get('/auth/callback/google', 
    passport.authenticate( 'google', { 
        successRedirect: '/auth/callback/social-success',
        failureRedirect: '/auth/login'
    })
);

app.get('/twitter-login',
  passport.authenticate('twitter'));

app.get('/auth/callback/twitter',
    passport.authenticate('twitter', { 
        successRedirect: '/auth/callback/social-success',
        failureRedirect: '/twitter-login'
    })
);

app.post('/upload', upload.single("file"), function (req, res) {
    const file = req.file;
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: Date.now().toString().slice(0,3) + '/' + Date.now() + '-' + file.originalname, // File name you want to save as in S3
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read'
    };

    s3.upload(params, function(err, data) {
        console.log(data)
        if (err) {
            res.json({success: false, message: 'The upload of the file could not be completed.'});
        }
        res.json({success: true, message: 'The file has been uploaded successfully.', file: data.Location});
    });
})

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401);
      res.json({"message" : err.name + ": " + err.message});
    }
});

// web server 8080

app.listen(8888, () => console.log('-- [ MAESTEROKIDS NODE ] SERVER STARTED LISTENING ON PORT 8888 --'));
