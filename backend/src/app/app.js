const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const usersRouter = require("../router/user.router");
const usersPostsRouter = require("../router/userPosts.router");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("This is express");
});

// routers

app.use("/api/v1", usersRouter);
app.use("/api/v1/posts", usersPostsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Ocurrió un error en el servidor",
  });
});

module.exports = app;
