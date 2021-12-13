// const db = require('../db/index')
const bcrypt = require('bcryptjs')
// Use this package to generate Token string
const jwt = require('jsonwebtoken')
const config = require('../config')
const mongodb = require('../db/mongodb')
const { UnauthorizedError } = require('express-jwt')
const url = "mongodb://localhost:27017/";
const uuid = require('uuid')

exports.regUser = (req, res) => {
// Receive form data
const userinfo = req.body;
    mongodb.connect(url, async function(err, client) {
        if(err) throw err;
        var db = await client.db("articleSystem");
        var collection = db.collection("user");
        var query = {
            "userName": userinfo.username
        };

        var projection = {
            "userName": "$userName",
            "_id": 0
        };
        await collection.find(query).toArray(function(err, result) {
            if (err) {return res.cc(err)};
            // console.log(result[0].userName)
            console.log(result.length)
            if (result.length > 0) {
                return res.cc('The username is occupied, please change another username!')
            }
            userinfo.password = bcrypt.hashSync(userinfo.password, 10)
            console.log(userinfo.password);
            query = {
                "userId": uuid.v4(),
                "userName": userinfo.username,
                "password": userinfo.password,
                "nickName": null,
                "email": null,
                "userPicture": null
            }
            collection.insertOne(query, function(err) {
                
                if (err) {
                    throw err;
                };
                res.send({ status: 0, message: 'registration success!' })
            });
        });
    });
}


// Registered processing function
exports.login = (req, res) => {
    const userinfo = req.body
    console.log(req.body)
    mongodb.connect(url, async function(err, client) {
        if(err) throw err;
        var db = await client.db("articleSystem");
        var collection = db.collection("user");
        var query = {
            "userName": userinfo.username
        };

        var projection = {
            "userName": "$userName",
            "_id": 0
        };
        await collection.find(query).toArray(function(err, result) {
            if (err) {return res.cc(err)};
            // console.log(result[0].userName)
            console.log(result.length)
            // The SQL statement is executed successfully, but the number of data items queried is not equal to 1
            if (result.length !== 1) return res.cc('invalid username or password!')
            // Take the password entered by the user and compare it with the password stored in the database
            const compareResult = bcrypt.compareSync(userinfo.password, result[0].password)
            // If the result of the comparison is equal to false, it proves that the password entered by the user is wrong
            if (!compareResult) {
                return res.cc('invalid username or password!')
            }
            // After culling, only the user’s id, username, nickname, and email values ​​are retained in user.
            const user = { ...result[0], password: '', userPicture: '' }
            // Generate Token string
            const tokenStr = jwt.sign(user, config.jwtSecretKey, {
                expiresIn: config.expiresIn, // The token is valid for 10 hours
            })
            res.send({
                status: 0,
                message: 'login successful!',
                // In order to facilitate the use of Token by the client, the prefix of Bearer is directly spliced ​​on the server side
                token: 'Bearer ' + tokenStr,
            })
        });
    });
}