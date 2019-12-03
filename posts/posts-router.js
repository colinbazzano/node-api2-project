const express = require("express");

const router = express.Router();

const Posts = require("../data/db");

router.post("/", (req, res) => {
  const postData = req.body;

  if (!postData.title || !postData.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  Posts.insert(postData)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "These was an error while saving the post to the database."
      });
    });
});

module.exports = router;
