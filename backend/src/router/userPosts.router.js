const router = require("express").Router();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserPosts = require("../model/userPosts.model");
const { response } = require("express");
const { json } = require("sequelize");
const authenticateToken = require("../midd/authMiddleware.middleware");
const sequelize = require("../connection");

// get all posts
router.get("/userPost", authenticateToken, async (req, res) => {
  try {
    const result = await sequelize.query("CALL spUserPosts();");

    if (!result) {
      res.status(409).json({
        ok: false,
        status: 409,
        message: "Bad request",
      });
    }

    res.json({
      ok: true,
      data: result,
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      message: "Error fetching user data",
    });
  }
});

// get one post
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
router.post(
  "/userPost",
  cors({
    origin: "http://localhost:3000",
    methods: ["POST"],
  }),
  authenticateToken,
  async (req, res) => {
    const { title, content, postImage, postLevel } = req.body;

    // Validación de campos requeridos
    if (!title || !content || !postLevel) {
      return res.status(400).json({
        ok: false,
        message: "All fields are required",
      });
    }

    let bufferImg = null;

    try {
      // Procesa la imagen solo si existe y está en formato Base64
      if (postImage) {
        if (postImage.startsWith("data:image")) {
          const base64Data = postImage.split(",")[1];
          bufferImg = Buffer.from(base64Data, "base64");
        } else {
          return res.status(400).json({
            ok: false,
            message: "Invalid image format. Expected Base64 with data URI.",
          });
        }
      }

      // Obtén el ID del usuario del token
      const idUserFromToken = req.idUser;

      // Crea el nuevo post
      const newUserPost = await UserPosts.create({
        idUser: idUserFromToken,
        title,
        content,
        postImage: bufferImg,
        postLevel,
      });

      // Responde con éxito
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
  }
);

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

// show posts
router.get(
  "/userPost/getposts/:idUser",
  authenticateToken,
  async (req, res) => {
    try {
      const id = req.params.idUser;
      const result = await sequelize.query("CALL spGetUserPosts(:user_id);", {
        replacements: { user_id: id },
      });

      if (!result) {
        res.status(409).json({
          ok: false,
          status: 409,
          message: "user posts empty",
        });
      }

      res.json({
        ok: true,
        data: result,
      });
    } catch (err) {
      console.error("Error", err);
      res.status(500).json({
        ok: false,
        message: "Error fetching user data",
      });
    }
  }
);

module.exports = router;
