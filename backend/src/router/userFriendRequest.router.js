const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const authenticateToken = require("../midd/authMiddleware.middleware");
const UserFriendRequest = require("../model/userFriendRequest.model");
const { response } = require("express");
const User = require("../model/user.model");
const sequelize = require("../connection");

// lista de amigos
router.get("/friendRequest/friends/:idUser", async (req, res) => {
  try {
    const id = req.params.idUser;

    const result = await sequelize.query("CALL spUserFriends(:user_id);", {
      replacements: { user_id: id },
    });

    if (!result) {
      res.status(409).json({
        ok: false,
        status: 409,
        message: "No friend request",
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

// solicitudes de amistad del usuario
router.get("/friendRequest/:idReceptor", async (req, res) => {
  try {
    const id = req.params.idReceptor;

    const result = await sequelize.query(
      "CALL spUserFriendRequests(:id_receptor);",
      {
        replacements: { id_receptor: id },
      }
    );

    if (!result) {
      res.status(409).json({
        ok: false,
        status: 409,
        message: "No friend request",
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

router.get("/friendRequest", async (req, res) => {
  const friendRequest = await UserFriendRequest.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: friendRequest,
  });
});

// enviar solicitud de amistad
router.post("/friendRequest", authenticateToken, async (req, res) => {
  const { idSender, idReceptor } = req.body;

  if (!idSender || !idReceptor) {
    res.status(400).json({
      ok: false,
      status: 400,
      message: "All fields are required",
    });
  }

  if (idSender === idReceptor) {
    return res.status(409).json({
      ok: false,
      status: 409,
      message: "cant send a friend request to yourself",
    });
  }

  try {
    const existingRequest = await UserFriendRequest.findOne({
      where: {
        idSender,
        idReceptor,
        isAccepted: false,
        isActive: true,
      },
    });
    if (existingRequest) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "There is already a pending friend request to this user",
      });
    }
    const reciprocalRequest = await UserFriendRequest.findOne({
      where: {
        idSender: idReceptor,
        idReceptor: idSender,
        isAccepted: false,
        isActive: true,
      },
    });
    if (reciprocalRequest) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "This user has already sent you a friend request",
      });
    }

    const alreadyFriends = await UserFriendRequest.findOne({
      where: {
        idSender,
        idReceptor,
        isAccepted: true,
        isActive: false,
      },
    });

    if (alreadyFriends) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "You and this user are already friends",
      });
    }

    const reciprocalFriends = await UserFriendRequest.findOne({
      where: {
        idSender: idReceptor,
        idReceptor: idSender,
        isAccepted: true,
        isActive: false,
      },
    });

    if (reciprocalFriends) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "You and this user are already friends",
      });
    }

    const newFriendRequest = await UserFriendRequest.create({
      idSender,
      idReceptor,
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: "Friend request sent",
      friendRequest: newFriendRequest,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      status: 500,
      error: err.message,
    });
  }
});

// actualizar solicitud de amistad - aceptar/rechazar
router.put("/friendRequest/:idFriend", async (req, res) => {
  // idFriendRequest
  const { idFriend } = req.params;
  const { friendRequestAccepted } = req.body;

  if (typeof friendRequestAccepted !== "number") {
    return res.status(400).json({
      ok: false,
      message: "friendRequestAccepted must be a number.",
    });
  }

  try {
    if (friendRequestAccepted === 1) {
      const data = {};
      data.isAccepted = 1;
      data.isActive = 0;

      const update = await UserFriendRequest.update(data, {
        where: {
          idFriend: idFriend,
        },
      });

      if (update[0] === 0) {
        console.log(idFriend);
        return res.status(404).json({
          ok: false,
          message: "Not found",
          idFriend,
        });
      }
      res.status(200).json({
        ok: true,
        status: 200,
        message: "Updated successfully",
      });
    } else if (friendRequestAccepted === 0) {
      const data = {};
      data.isAccepted = 0;
      data.isActive = 0;
      const update = await UserFriendRequest.update(data, {
        where: {
          idFriend: idFriend,
        },
      });
      if (update[0] === 0) {
        console.log(idFriend);
        return res.status(404).json({
          ok: false,
          message: "Not found",
          idFriend,
        });
      }
      res.status(200).json({
        ok: true,
        status: 200,
        message: "Updated successfully",
      });
    } else {
      return res.status(400).json({
        ok: false,
        message: "Invalid friendRequestAccepted value. It must be 0 or 1.",
      });
    }
  } catch (err) {
    console.error("Error updating", err);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error updating",
    });
  }
});

module.exports = router;
