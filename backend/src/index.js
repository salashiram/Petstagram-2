const app = require("./app/app");
// const cors = require("cors");
// require("dotenv").config();

// app.use(cors()); // Use this after the variable declaration

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
