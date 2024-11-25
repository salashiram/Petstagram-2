const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../midd/authMiddleware.middleware");
const ShoppingCart = require("../model/shoppingCart.model");
const Product = require("../model/product.model");
const { response } = require("express");
const sequelize = require("../connection");

router.get("/shoppingCart", async (req, res) => {
  const userCart = await ShoppingCart.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: userCart,
  });
});

router.get(
  "/shoppingCart/details/:idUser",
  authenticateToken,
  async (req, res) => {
    try {
      const idUser = req.params.idUser;
      // Filtrar carritos activos (isActive: true)
      const cartDetails = await ShoppingCart.findAll({
        where: {
          idUser,
          isActive: true, // Solo traer carritos activos
        },
        include: [
          {
            model: Product,
            as: "product",
            attributes: [
              "name",
              "category",
              "description",
              "image",
              "stock",
              "unityPrice",
              "discount",
              "createdAt",
              "updatedAt",
            ],
          },
        ],
      });

      res.status(200).json({
        ok: true,
        status: 200,
        body: cartDetails,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        ok: false,
        status: 500,
        message: "Error fetching cart details",
        error: err.message,
      });
    }
  }
);

// deactivate shopping cart
router.put(
  "/shoppingCart/:idShoppingCart",
  authenticateToken,
  async (req, res) => {
    try {
      const idShoppingCart = req.params.idShoppingCart;
      const updateShoppingCart = await ShoppingCart.update(
        {
          isActive: 0,
        },
        {
          where: {
            idShoppingCart: idShoppingCart,
          },
        }
      );

      res.status(200).json({
        ok: true,
        status: 200,
        body: updateShoppingCart,
        message: "Shopping cart deactivate",
      });
    } catch (err) {
      console.error("Error", err);
      res.status(500).json({
        ok: false,
        status: 500,
        error: err,
      });
    }
  }
);

// crear shopping cart
router.post("/shoppingCart", authenticateToken, async (req, res) => {
  const { idUser, idProduct } = req.body;
  if (!idUser || !idProduct) {
    return res.status(400).json({
      ok: false,
      message: "All fields are required",
    });
  }

  try {
    const existingCart = await ShoppingCart.findOne({
      where: { idUser, isActive: 1 },
    });

    if (existingCart) {
      return res.status(409).json({
        ok: true,
        status: 409,
        message: "A shopping cart is already active for this user",
      });
    }

    const newShoppingCart = await ShoppingCart.create({
      idUser,
      idProduct,
    });
    res.status(201).json({
      ok: true,
      status: 201,
      message: "Shopping cart created successfully",
      newShoppingCart: newShoppingCart,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error creating shopping cart",
      error: err.message,
    });
  }
});

module.exports = router;
