const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  userNewUrlParser: true,
});

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (err) {
        res.send("error in request, data not found");
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article");
      } else {
        res.send("Error occurred");
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("success");
      } else {
        res.send("failure");
      }
    });
  });

/* request targeting a specific article */

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (!foundArticle) {
          res.send("<p>error is here, do you want to fire sudip modi?</p>");
        } else {
          res.send(foundArticle);
        }
      }
    );
  }).put(function (req, res) {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("successfully updated article");
        }
      }
    );
  })
  .patch(function(req,res){
      Article.findOneAndUpdate({title: req.params.articleTitle},{$set: req.body},function(err){
          if(!err){
              res.send("successfully updated article");
          }else {
              res.send(err);
          }
      })
  }).delete(function(req,res){
      Article.deleteMany({title: req.params.articleTitle},function(err){
          if(!err){
              res.send("successfully deleted");
          }else{
              res.send("error");
          }
      })
  })
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
