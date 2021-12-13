const uuid = require("uuid");
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";

// Get the processing function of the article classification list data
exports.getArticleCates = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    var query = {
      isDelete: false,
    };
    dbo
      .collection("category")
      .find(query)
      .toArray(function (err, results) {
        if (err) throw err;
        res.send({
          status: 0,
          message: "Get the article category list successfully!",
          data: results,
        });
        db.close();
      });
  });
};

// Added processing function for article classification
exports.addArticleCates = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    // duplicate checking
    var query = {
      $or: [{ name: req.body.name }, { alias: req.body.alias }],
    };
    dbo
      .collection("category")
      .find(query)
      .toArray(function (err, results) {
        if (err) throw err;
        // Determine the length of the data
        if (results.length === 2)
          return res.cc(
            "The category name and category alias are occupied, please change and try again!"
          );
        // Three cases where length is equal to 1
        if (
          results.length === 1 &&
          results[0].name === req.body.name &&
          results[0].alias === req.body.alias
        )
          return res.cc(
            "The category name and category alias are occupied, please change and try again!"
          );
        if (results.length === 1 && results[0].name === req.body.name)
          return res.cc(
            "The category name is occupied, please change and try again!"
          );
        if (results.length === 1 && results[0].alias === req.body.alias)
          return res.cc(
            "The category alias is occupied, please change and try again!"
          );

        var document = {
          cateId: uuid.v4(),
          name: req.body.name,
          alias: req.body.alias,
          isDelete: false,
          userId: req.user.userId,
        };
        dbo.collection("category").insertOne(document, function (err, results) {
          if (err) return res.cc(err);
          res.cc("The newly added article is classified successfully!", 0);
          db.close();
        });
      });
  });
};

// Processing function of deleting article classification
exports.deleteCateById = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    var query = { cateId: req.params.id };
    // console.log(typeof(req.params.id));
    // console.log(typeof(cateId));
    var update = { $set: { isDelete: true } };
    dbo
      .collection("category")
      .updateOne(query, update, function (err, results) {
        if (err) throw err;
        res.cc("Delete the article category successfully!", 0);
        db.close();
      });
  });
};

// Processing function of getting article category by id
exports.getArticleById = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    var query = {
      cateId: req.params.id,
    };
    dbo
      .collection("category")
      .find(query)
      .toArray(function (err, results) {
        if (err) throw err;
        if (results.length !== 1)
          return res.cc("Failed to get article classification data!");
        res.send({
          status: 0,
          message: "Get the article classification data successfully!",
          data: results[0],
        });
        db.close();
      });
  });
};

// Update the processing function of the article classification
exports.updateCateById = (req, res) => {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("articleSystem");
    var query = {
      cateId: {$ne :req.body.cateId},
      $or: [{name: req.body.name}, {alias: req.body.alias}]
    };
    dbo
      .collection("category")
      .find(query)
      .toArray(function (err, results) {
        if (err) throw err;

        // 4 situations in which names and aliases are occupied
        if (results.length === 2)
          return res.cc(
            "The category name and alias are occupied, please change and try again!"
          );
        if (
          results.length === 1 &&
          results[0].name === req.body.name &&
          results[0].alias === req.body.alias
        )
          return res.cc(
            "The category name and category alias are occupied, please change and try again!"
          );
        if (results.length === 1 && results[0].name === req.body.name)
          return res.cc(
            "The category name is occupied, please change and try again!"
          );
        if (results.length === 1 && results[0].alias === req.body.alias)
          return res.cc(
            "The category alias is occupied, please change and try again!"
          );

        var query2 = { cateId: req.body.cateId };
        var update = {
          $set: {
            cateId: req.body.cateId,
            name: req.body.name,
            alias: req.body.alias,
          },
        };
        dbo
          .collection("category")
          .updateOne(query2, update, function (err, results) {
            if (err) return res.cc(err);
            res.cc("Successfully updated the article classification!", 0);
            db.close();
          });
      });
  });
};
