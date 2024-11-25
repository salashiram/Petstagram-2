const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../midd/authMiddleware.middleware");
const User = require("../model/user.model");
const { response } = require("express");
const sequelize = require("../connection");

router.get("/user", authenticateToken, async (req, res) => {
  const user = await User.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: user,
  });
});

router.get("/user/userInfo/:idUser", authenticateToken, async (req, res) => {
  try {
    const id = req.params.idUser;
    const result = await sequelize.query(
      "CALL spShowUserProfileInfo(:id_user)",
      {
        replacements: { id_user: id },
      }
    );

    console.log(result);

    if (!result[0] || result[0].length === 0) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "No info to show",
      });
    }

    const user = result[0][0];

    console.log("User data found:", user);

    res.status(200).json({
      ok: true,
      data: result,
      message: "User found",
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      message: "Error fetching user data",
    });
  }
});

router.get("/user/:idUser", authenticateToken, async (req, res) => {
  try {
    const id = req.params.idUser;
    const user = await User.findOne({
      where: { idUser: id },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      ok: true,
      body: user,
      message: "User found",
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      message: "Error fetching user data",
    });
  }
});

// get data by email
router.get("/user/email/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      body: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error fetching user",
      error: error.message,
    });
  }
});

router.post("/user", async (req, res) => {
  const { userName, email, pass, firstName, lastName, gender, userImage } =
    req.body;

  if (!userName || !email || !pass || !firstName || !lastName || !gender) {
    return res.status(400).json({
      ok: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUserName = await User.findOne({ where: { userName } });
    const existingEmail = await User.findOne({ where: { email } });
    if (existingUserName) {
      return res.status(400).json({
        ok: false,
        message: "Username already exists",
      });
    } else if (existingEmail) {
      return res.status(400).json({
        ok: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = await User.create({
      userName,
      pass: hashedPassword,
      firstName,
      lastName,
      email,
      gender,
      userImage,
    });

    // Crear token JWT
    const token = jwt.sign({ id: newUser.idUser }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error creating user",
      error: err.message,
    });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      ok: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.pass);
    if (!isPasswordValid) {
      return res.status(400).json({
        ok: false,
        message: "Invalid email or password",
      });
    }

    // Crear token JWT
    const token = jwt.sign({ id: user.idUser }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token,
      user: {
        id: user.idUser,
        email: user.email,
        fullName: user.fullName,
        username: user.userName,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Error logging in",
      error: error.message,
    });
  }
});

//  UPDATE
router.put("/user/:idUser", authenticateToken, async (req, res) => {
  const { idUser } = req.params;
  const { userName, email, firstName, lastName, gender, about, imageProfile } =
    req.body;

  try {
    const dataUser = {};
    if (userName) dataUser.userName = userName;
    if (firstName) dataUser.firstName = firstName;
    if (lastName) dataUser.lastName = lastName;
    if (email) dataUser.email = email;
    if (gender) dataUser.gender = gender;
    if (imageProfile) dataUser.imageProfile = imageProfile;
    if (about) dataUser.about = about;

    const updateUser = await User.update(dataUser, {
      where: {
        idUser: idUser,
      },
    });

    if (updateUser[0] === 0) {
      console.log(idUser);
      return res.status(404).json({
        ok: false,
        message: "User not found",
        idUser,
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error updating user",
    });
  }
});

// baja logica del usuario
router.put("/user/deactivate/:idUser", async (req, res) => {
  try {
    const id = req.params.idUser;
    const updateUser = await User.update(
      {
        isActive: 0,
      },
      {
        where: {
          idUser: id,
        },
      }
    );
    res.status(200).json({
      ok: true,
      status: 200,
      body: updateUser,
      message: "User deactivate",
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

router.delete("/user/:idUser", async (req, res) => {
  try {
    const id = req.params.idUser;
    const deleteUser = await User.destroy({
      where: {
        idUser: id,
      },
    });
    res.status(200).json({
      ok: true,
      status: 204,
      body: deleteUser,
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

router.post("revoke", authenticateToken, (req, res) => {
  const token = req.token;
  revokeToken(token);
  res.json({
    ok: true,
    message: "Close session successfully",
  });
});

module.exports = router;
