const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserPosts = require("../model/userPosts.model");
const { response } = require("express");
const { json } = require("sequelize");

// get all
router.get("/userPost", async (req, res) => {
  try {
    const post = await UserPosts.findAll();
    res.status(200).json({
      ok: true,
      status: 200,
      body: post,
    });
    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "empty",
      });
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      status: 500,
    });
  }
});

// get one
router.get("/userPost/:idPost", async (req, res) => {
  try {
    const id = req.params.idPost;
    const post = await UserPosts.findOne({
      where: {
        idPost: id,
      },
    });
    if (!post) {
      return res.status(404).json({
        ok: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      ok: true,
      status: 200,
      body: post,
      message: "Post found",
      postId: id,
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      status: 500,
    });
  }
});

// post
router.post("/userPost", async (req, res) => {
  const { idUser, title, content, postImage, postLevel } = req.body;

  if (!idUser || !title || !content || !postLevel) {
    return (
      res.status(400),
      json({
        ok: false,
        message: "All fields are required",
      })
    );
  }

  try {
    const newUserPost = await UserPosts.create({
      idUser,
      title,
      content,
      postImage,
      postLevel,
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: "Post created successfully",
      userPost: newUserPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error creating post",
      error: err.message,
    });
  }
});

// udate post
router.put("/userPost/:idPost", async (req, res) => {
  try {
    const id = req.params.idPost;
    const dataPost = req.body;
    const updatePostUser = await UserPosts.update(
      {
        title: dataPost.title,
        content: dataPost.content,
        postImage: dataPost.postImage,
        postLevel: dataPost.postLevel,
      },
      {
        where: {
          idPost: id,
        },
      }
    );
    res.status(200).json({
      ok: true,
      status: 200,
      body: updatePostUser,
      message: "Post updated ",
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      status: 500,
      error: err,
    });
  }
});

// delete post;
router.delete("/userPost/:idPost", async (req, res) => {
  try {
    const id = req.params.idPost;
    const deleteUserPost = await UserPosts.destroy({
      where: {
        idPost: id,
      },
    });
    res.status(200).json({
      ok: true,
      status: 204,
      body: deleteUserPost,
      message: "Post deleted",
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      status: 500,
      error: err,
    });
  }
});

// baja logica del post
router.put("/userPost/deactivate/:idPost", async (req, res) => {
  try {
    const id = req.params.idPost;
    const updatePost = await UserPosts.update(
      {
        isActive: 0,
      },
      {
        where: {
          idPost: id,
        },
      }
    );
    res.status(200).json({
      ok: true,
      status: 200,
      body: updatePost,
      message: "Post deactivate",
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      status: 500,
      error: err,
    });
  }
});

module.exports = router;
