const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGOURL, {
    useMongoClient: true,
    autoIndex: false,
});

const db_collections = [
    "base_countries",
    "base_grades",
    "base_languages",
    "base_payment_configs",
    "base_subjects",
    "data_accounts",
    "data_activities",
    "data_activity_comments",
    "data_activity_files",
    "data_contact_mails",
    "data_payments",
    "data_profiles",
    "data_student_subjects",
    "data_students"
];

mongoose.connection.once('open', function(){
    mongoose.connection.db.listCollections().toArray(function (err, collectionNames) {
        if (err) {
          console.log(err);
          return;
        }
        var nameArray = [];
        collectionNames.forEach((collection) => {
            nameArray.push(collection.name);
        })

        db_collections.forEach((name) => {
            if (nameArray.indexOf(name) == -1) {
                mongoose.connection.db.createCollection(name);
                console.log("Create '" + name + "' collection.");
            }
        })
    });
    console.log('-- [ MongoDB ] CONNECTION SUCCESSFUL --');
}).on('error', function(error){
    console.log('-- [ MongoDB ] CONNECTION ERROR :', error);
});