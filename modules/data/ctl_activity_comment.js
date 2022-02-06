var ActivityCommentSchema = require('../schemas/activity_comment_schema.js');

var resources = {
    _id: "$_id",
    activityid: {"$first":"$activityid"},
    accountid: {"$first":"$accountid"},
    comments: {"$first":"$comments"},
    rating: {"$first":"$rating"},
    like: {"$first":"$like"},
    dislike: {"$first":"$dislike"},
    created_at: {"$first":"$created_at"},
};

module.exports.get_activity_comment = async function (req, res) {
    try {
        var activityCommentDocs = await ActivityCommentSchema.find({}, {}, {sort: {activityid: 1}});
        res.status(201).json({success: true, doc: activityCommentDocs});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.get_activity_comments_by_id = async function (req, res) {
    try {
        var activityCommentDocs = await ActivityCommentSchema.aggregate([{
            $group: resources
        }, {
            $lookup: {
                from: "data_accounts", // collection to join
                localField: "accountid",//field from the input documents
                foreignField: "_id",//field from the documents of the "from" collection
                as: "account"// output array field
            },
        },{
            $lookup: {
                from: "data_profiles", // collection to join
                localField: "accountid",//field from the input documents
                foreignField: "accountid",//field from the documents of the "from" collection
                as: "profile"// output array field
            },
        }]);
        var resDoc = [];
        activityCommentDocs.forEach((doc) => {
            if (doc.activityid === req.body.activityid) {
                resDoc.push({
                    ...doc,
                    email: doc.account[0].email,
                    avatar: doc.account[0].avatar,
                    firstname: doc.profile[0].firstname,
                    lastname: doc.profile[0].lastname
                });
            }
        })
        res.status(201).json({success: true, doc: resDoc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.add_activity_comment = async function (req, res) {
    try {
        var doc = await ActivityCommentSchema.create(req.body.row);
        res.status(201).json({success: true, doc: doc});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.update_activity_comment = async function (req, res) {
    try {
        var updateOne = req.body.row;
        updateOne.modified_at = Date.now();
        await ActivityCommentSchema.updateOne({_id: req.body.row._id}, updateOne);
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}

module.exports.remove_activity_comment = async function (req, res) {
    try {
        await ActivityCommentSchema.remove({_id: req.body.row._id});
        res.status(201).json({success: true});
    } catch (error) {
        console.log(error);
        res.status(401).json({success: false, error: error});
    }
}
