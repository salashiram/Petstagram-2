const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../midd/authMiddleware.middleware");
const Product = require("../model/product.model");
const { response } = require("express");
const { json } = require("sequelize");

router.get("/product", async (req, res) => {
  const product = await Product.findAll();
  res.status(200).json({
    ok: true,
    status: 200,
    body: product,
  });
});

router.get("/product/deactivate/:idProduct", async (req, res) => {
  try {
    const id = req.params.idProduct;
    const product = await Product.findOne({
      where: { idProduct: id },
    });

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      ok: true,
      body: product,
      message: "Product found",
    });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({
      ok: false,
      message: "Error fetching user data",
    });
  }
});

// create product
router.post("/product", authenticateToken, async (req, res) => {
  const {
    idUser,
    category,
    discount,
    name,
    description,
    image,
    stock,
    unityPrice,
  } = req.body;

  if (!idUser || !category || !name || !description || !stock || !unityPrice) {
    return res.status(400).json({
      ok: false,
      message: "All fields are required",
    });
  }

  try {
    // const idUserFromToken = req.idUser;
    const newProduct = await Product.create({
      idUser,
      category,
      discount,
      name,
      description,
      image,
      stock,
      unityPrice,
    });

    res.status(201).json({
      ok: true,
      status: 201,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error creating product",
      error: err.message,
    });
  }
});

// update product
router.put("/product/:idProduct", authenticateToken, async (req, res) => {
  try {
    const id = req.params.idProduct;
    const dataProduct = req.body;
    const updateProduct = await Product.update(
      {
        category: dataProduct.category,
        discount: dataProduct.discount,
        name: dataProduct.name,
        description: dataProduct.description,
        image: dataProduct.image,
        stock: dataProduct.stock,
        unityPrice: dataProduct.unityPrice,
      },
      {
        where: {
          idProduct: id,
        },
      }
    );
    res.status(200).json({
      ok: true,
      status: 200,
      body: updateProduct,
      message: "Product updated",
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

// delete product
router.put(
  "/product/deactivate/:idProduct",
  authenticateToken,
  async (req, res) => {
    try {
      const id = req.params.idProduct;
      const updateProduct = await Product.update(
        {
          isActive: 0,
        },
        {
          where: {
            idProduct: id,
          },
        }
      );
      res.status(200).json({
        ok: true,
        status: 200,
        body: updateProduct,
        message: "Product deleted",
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

module.exports = router;
