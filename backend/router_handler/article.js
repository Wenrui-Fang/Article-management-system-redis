// Import the path core module of the processing path
const path = require("path");
// const db = require('../db/index')
const uuid = require("uuid");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
const { createClient } = require("redis");

// Processing function for publishing new articles
exports.addArticle = (req, res) => {
  // Manually determine whether the article cover is uploaded
  if (!req.file || req.file.fieldname !== "coverImg")
    return res.cc("Image cover is required!");

  const articleInfo = {
    // Title, content, status, category Id to which it belongs
    ...req.body,
    // The storage path of the article cover on the server side
    coverImg: path.join("/uploads", req.file.filename),
    // Article publication time
    pubDate: new Date(),
    // Id of the author of the article
    userId: req.user.userId,
  };

  console.log(articleInfo);

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    var document = {
      articleId: uuid.v4(),
      title: articleInfo.title,
      content: articleInfo.content,
      coverImg: articleInfo.coverImg,
      pubDate: articleInfo.pubDate,
      status: articleInfo.state,
      isDelete: false,
      userId: articleInfo.userId,
      cateId: articleInfo.cateId,
    };
    // console.log(req);
    dbo.collection("article").insertOne(document, function (err, results) {
      if (err) throw err;
      db.close();
    });
  });
};

// Get the processing function of the article list data
exports.getArticleLists = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    if (req.query.cate_id === "") {
      var operation = [
        {
          $lookup: {
            from: "category",
            localField: "cateId",
            foreignField: "cateId",
            as: "category",
          },
        },
        { $match: { isDelete: false } },
      ];
      dbo
        .collection("article")
        .aggregate(operation)
        .toArray(function (err, results) {
          if (err) throw err;
          for (let i = 0; i < results.length; i++) {
            let a = results[i].category[0].name;
            results[i].category = a;
          }
          res.send({
            status: 0,
            message: "Get the article list successfully!",
            data: results,
          });
          db.close();
        });
    } else {
      var operation = [
        {
          $lookup: {
            from: "category",
            localField: "cateId",
            foreignField: "cateId",
            as: "category",
          },
        },
        { $match: { isDelete: false, cateId: req.query.cate_id } },
      ];
      dbo
        .collection("article")
        .aggregate(operation)
        .toArray(function (err, results) {
          if (err) throw err;
          for (let i = 0; i < results.length; i++) {
            let a = results[i].category[0].name;
            results[i].category = a;
          }
          res.send({
            status: 0,
            message: "Get the article list successfully!",
            data: results,
          });
          db.close();
        });
    }
  });
};

// Delete the processing function of the article category
exports.deleteArticleById = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    var query = { articleId: req.params.id };
    var update = { $set: { isDelete: true } };
    dbo.collection("article").updateOne(query, update, function (err, results) {
      if (err) throw err;
      res.cc("The article was deleted successfully!", 0);
      db.close();
    });
  });
};

exports.rankingArticleNumOfArticle = (req, res) => {
  setUpData(res);
};

async function setUpData(res) {
  let client;
  client = createClient();
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
  console.log("connected");
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");

    var operation = [
      {
        $lookup: {
          from: "category",
          localField: "cateId",
          foreignField: "cateId",
          as: "category",
        },
      },
      { $match: { isDelete: false } },
    ];
    const value = new Set();
    dbo.collection("article").aggregate(operation).toArray(async function (err, results) {
      if (err) throw err;
      for (let i = 0; i < results.length; i++) {
        let a = results[i].category[0].name;
        value.add(a);
        await client.set(a, "0");
      }
      for (let i = 0; i < results.length; i++) {
        let a = results[i].category[0].name;
        await client.incr(a);
        results[i].category = a;
      }
      db.close();
    });
    setTimeout(async function () {
      for (let item of value) {
        let result = await client.get(item);
        client.zAdd(`leaderboard`, {
          score: result,
          value: item
        })
      }
      var final = await client.zRangeWithScores("leaderboard", -10, -1, `withscores`);
      console.log(final);
      res.send({
        status: 0,
        message: "Get the article list successfully!",
        data: final,
      });

      await client.quit();
    }, 1500);
  });
}