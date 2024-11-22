const router = require("express").Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("../midd/authMiddleware.middleware");
const UserPostReactions = require("../model/userPostReactions.model");
const { response } = require("express");
const { json } = require("sequelize");

router.get("/postsReactions", async (req, res) => {
  try {
    const userPostsReactions = await UserPostReactions.findAll();
    res.status(200).json({
      ok: true,
      status: 200,
      body: userPostsReactions,
    });
    if (!userPostsReactions) {
      res.status(404).json({
        ok: false,
        status: 404,
        message: "empty",
      });
    }
  } catch (err) {
    res.status(500).json({
      ok: false,
      status: 500,
      body: err,
    });
  }
});

router.post("/postsReactions", async (req, res) => {
  const { idPost, idUser } = req.body;
  if (!idPost || !idUser) {
    return (
      res.status(400),
      json({
        ok: false,
        message: "All fields are required",
      })
    );
  }

  try {
    const newPostReaction = await UserPostReactions.create({
      idPost,
      idUser,
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: "OK",
      postReaction: newPostReaction,
    });
  } catch (err) {
    console.log(err);
    res.status(500),
      json({
        ok: false,
        status: 500,
        message: "Error",
        error: err.message,
      });
  }
});

module.exports = router;
