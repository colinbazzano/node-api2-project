const express = require("express");

const postsRouter = require("../posts/posts-router");

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>Node API 2 Project</h2>
    <p>I can type elements here, neat!</p>`);
});

module.exports = server;
