const { Sequelize, Model, DataTypes, BOOLEAN, DECIMAL } = require("sequelize");
const sequelize = require("../connection");
const User = require("./user.model");
const Product = require("./product.model");
class ShoppingCart extends Model {}

ShoppingCart.init(
  {
    idShoppingCart: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "idUser",
      },
    },
    idProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "idProduct",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "ShoppingCart",
    tableName: "ShoppingCart",
  }
);

// ShoppingCart.hasOne(Product, {
//   foreignKey: "idProduct",
// });

User.hasOne(ShoppingCart, {
  foreignKey: "idUser",
});

ShoppingCart.belongsTo(User, {
  foreignKey: "idUser",
});

ShoppingCart.belongsTo(Product, { foreignKey: "idProduct", as: "product" });

// Product model
Product.hasMany(ShoppingCart, { foreignKey: "idProduct", as: "carts" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Modelos sincronizados con la base de datos.");
  })
  .catch((err) => {
    console.error("Error al sincronizar modelos:", err);
  });

module.exports = ShoppingCart;
