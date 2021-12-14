// Import database operation module
// const db = require("../db/index");
const mongodb = require('../db/mongodb')
const url = "mongodb://localhost:27017/";
// Import bcryptjs
const bcrypt = require("bcryptjs");

// Processing function for obtaining basic user information
exports.getUserInfo = (req, res) => {
    mongodb.connect(url, async function(err, client) {
        if (err) {
            return res.cc(err)
        };
        var db = await client.db("articleSystem");
        var collection = db.collection("user");
        var query = {
            "userId": req.user.userId
        };

        await collection.find(query).toArray(function(err, result) {
            if (err) {
                return res.cc(err)
            };
            // console.log(result[0].userName)
            res.send({
                status: 0,
                message: "Get user basic information successfully！",
                data: result[0],
            });
            
        });
    });
};

// Processing function for updating user's basic infomation
exports.updateUserInfo = (req, res) => {

    mongodb.connect(url, async function(err, client) {
        if (err) return res.cc(err);
        var db = await client.db("articleSystem");
        var collection = db.collection("user");
        var myquery = { "userId": req.body.userId };
        var newvalues = { $set: {"nickName": req.body.nickName,"email": req.body.email } };
        collection.updateOne(myquery, newvalues, function(err, result) {
            if (err) return res.cc(err);
            return res.cc("Succeed to update the user information!", 0);
          });
    });
};

// Processing function for updating user's pwd
exports.updatePassword = (req, res) => {
    mongodb.connect(url, async function(err, client) {
        if (err) return res.cc(err);

        var db = await client.db("articleSystem");
        var collection = db.collection("user");
        var query = { "userId": req.user.userId };
        collection.find(query).toArray(function(err, result) {
            
            if (err) return res.cc(err);
            if (result.length !== 1) return res.cc("user not found!");
            // Determine whether the submitted old password is correct
            const compareResult = bcrypt.compareSync(
                req.body.oldPwd,
                result[0].password
            );
            if (!compareResult) return res.cc("The original password is wrong!");
        });

        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        console.log(newPwd)
        var newvalues = { $set: {"password": newPwd } };

        collection.updateOne(query, newvalues, function(err, result) {
            if (err) return res.cc(err);
            
            res.cc("Succeeded to update pwd!", 0);
        });
    });
};