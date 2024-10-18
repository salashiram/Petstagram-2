const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("../router/user.router");

const app = express();

// parsear JSON
app.use(express.json());

// solicitudes frontend
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("This is express");
});

app.use("/api/v1", router);

module.exports = app;
