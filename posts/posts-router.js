const express = require("express");

const router = express.Router();

const Posts = require("../data/db");

// POST A POST
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

// POST A COMMENT
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
            "There was an error while saving the comment to the database."
        });
      });
  }
});

// GET POSTS
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

// GET POST BY ID
router.get("/:id", (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then(post => {
      post
        ? res.status(200).json(post)
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  Posts.findById(id)
    .then(comment => {
      comment
        ? res.status(200).json(comment)
        : res.status(404).json({
            message: "The  with the specified ID does not exist."
          });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const id = req.params.id;
  const commentData = req.body;

  Posts.findPostComments(id)
    .then(comment => {
      comment.length > 0
        ? res.status(200).json(commentData.text)
        : Posts.findById(id)
            .then(post => {
              if (post.length > 0) {
                res.status(404).json({
                  message:
                    "The post with the specified ID does not contain comments."
                });
              } else {
                res.status(404).json({
                  message: "The post with the specified ID does not exist."
                });
              }
            })
            .catch(error => {
              console.log(error);
              res.status(500).json({
                error: "The post information could not be retrieved. "
              });
            });
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// router.get("/:id/comments", (req, res) => {
//   const id = req.params.id;
//   const commentData = req.body;
//   Posts.findById(id)
//     .then(post => {
//       if (post.length !== 0) {
//         Posts.findPostComments(commentData)
//           .then(comment => {
//             res.status(201).json(...comment.text);
//           })
//           .catch(error => {
//             console.log(error);
//             res.status(500).json({
//               error:
//                 "There was an error while saving the comment to the database."
//             });
//           });
//       } else {
//         res
//           .status(404)
//           .json({ message: "The post with specified ID does not exist." });
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(500).json({
//         message: "There was an error while saving the comment to the database."
//       });
//     });
// });

module.exports = router;
