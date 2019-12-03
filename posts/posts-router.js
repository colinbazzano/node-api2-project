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

router.post("/:id/comments", (req, res) => {
  const id = req.params.id;
  const commentData = req.body;

  if (!commentData.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    Posts.findById(id)
      .then(post => {
        if (post.length !== 0) {
          Posts.insertComment(commentData)
            .then(comment => {
              res.status(201).json({ ...comment, ...commentData });
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database."
              });
            });
        } else {
          res
            .status(404)
            .json({ message: "The post with specified ID does not exist." });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message:
            "There was an erroe while saving the comment to the database."
        });
      });
  }
});

router.get("/", (req, res) => {
  Posts.find(req.query)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

module.exports = router;
