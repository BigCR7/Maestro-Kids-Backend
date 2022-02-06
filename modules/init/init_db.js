var CountrySchema = require('../schemas/country_schema.js');
var LanguageSchema = require('../schemas/language_schema.js');
var AccountSchema = require('../schemas/account_schema.js');
var ProfileSchema = require('../schemas/profile_schema.js');
var PaymentConfigSchema = require("../schemas/payment_config_schema.js");

var countryData = require('./country');
var languageData = require('./language');
var paymentConfigData = require('./payment_config');

var bcrypt = require('bcryptjs');

CountrySchema.findOne({},function(err,doc){
    if(!doc){
        try {
            for( var i = 0; i < countryData.length; i++ ) {
                new CountrySchema( countryData[ i ] ).save();
            }                
            console.log("Success: base_countries initialize");
        } catch (error) {
            console.log("Failed: base_countries initialize");
        }
    }
});

LanguageSchema.findOne({},function(err,doc){
    if(!doc){
        try {
            for( var i = 0; i < languageData.length; i++ ) {
                new LanguageSchema( languageData[ i ] ).save();
            }                
            console.log("Success: base_languages initialize");
        } catch (error) {
            console.log("Failed: base_languages initialize");
        }
    }
});

PaymentConfigSchema.findOne({},function(err,doc){
    if(!doc){
        try {
            for( var i = 0; i < paymentConfigData.length; i++ ) {
                new PaymentConfigSchema( paymentConfigData[ i ] ).save();
            }                
            console.log("Success: base_payment_configs initialize");
        } catch (error) {
            console.log("Failed: base_payment_configs initialize");
        }
    }
});

AccountSchema.findOne({},function(err,doc){
    if(!doc){
        try {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(process.env.ADMIN_PWD, salt);

            new AccountSchema({
                "_id": 1,
                "email": process.env.ADMIN_EMAIL,
                "password": hash,
                "profiletype": "admin",
                "token": Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                "isactive": true,
                "isdeleted": false,
                "isapproved": true
            }).save();
            console.log("Success: data_accounts initialize");
        } catch (error) {
            console.log(error);
            console.log("Failed: data_accounts initialize");
        }
    }
});

ProfileSchema.findOne({},function(err,doc){
    if(!doc){
        try {
            new ProfileSchema({
                firstname: 'Admin',
                lastname: '',
                accountid: 1,
                schoolname: '',
                country: 'AU',
                language: 'en'
            }).save();
            console.log("Success: data_profiles initialize");
        } catch (error) {
            console.log(error);
            console.log("Failed: data_profiles initialize");
        }
    }
});
