const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const usersRouter = require("../router/user.router");
const usersPostsRouter = require("../router/userPosts.router");
const userPostsReactionsRouter = require("../router/userPostReactions.router");
const userFriendRequest = require("../router/userFriendRequest.router");
const imageUploadRouter = require("../router/imageUpload.router");
const productRouter = require("../router/product.router");
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("This is express");
});

// routers
app.use("/api/v1", usersRouter);
app.use("/api/v1/posts", usersPostsRouter);
app.use("/api/v1/userPostsReactions", userPostsReactionsRouter);
app.use("/api/v1/userFriendRequest", userFriendRequest);
app.use("/api/v1/products", productRouter);
app.use("/api/v1", imageUploadRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Ocurrió un error en el servidor",
  });
});

module.exports = app;
