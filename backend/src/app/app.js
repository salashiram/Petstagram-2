const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const usersRouter = require("../router/user.router");
const usersPostsRouter = require("../router/userPosts.router");
const userPostsReactionsRouter = require("../router/userPostReactions.router");
const userFriendRequest = require("../router/userFriendRequest.router");
const imageUploadRouter = require("../router/imageUpload.router");
const productRouter = require("../router/product.router");
const shoppingCartRouter = require("../router/shoppingCart.router");
// const shoppingCartDetailRouter = require("../router/shoppingCartDetail.router");
const app = express();

// // Asegúrate de eliminar el prefijo "data:image/jpeg;base64,"
// const base64Data = profileImage.replace(/^data:image\/jpeg;base64,/, "");

// // Convertir base64 a buffer
// const imageBuffer = Buffer.from(base64Data, "base64");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/api/v1/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }

  const filePath = `/uploads/${req.file.filename}`;
  console.log("Ruta de la imagen subida:", filePath);
  res.json({ filePath });
});

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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/api/v1", usersRouter);
app.use("/api/v1/posts", usersPostsRouter);
app.use("/api/v1/userPostsReactions", userPostsReactionsRouter);
app.use("/api/v1/userFriendRequest", userFriendRequest);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", shoppingCartRouter);
// app.use("/api/v1/cartDetail", shoppingCartDetailRouter);
app.use("/api/v1", imageUploadRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    message: "Ocurrió un error en el servidor",
  });
});

module.exports = app;
