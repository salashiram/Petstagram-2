const { Sequelize, Model, DataTypes, BOOLEAN, DECIMAL } = require("sequelize");
const sequelize = require("../connection");
const User = require("../model/user.model");
class Product extends Model {}

Product.init(
  {
    idProduct: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "idUser",
      },
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    unityPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "Product",
  }
);

User.hasMany(Product, {
  foreignKey: "idUser",
});

Product.belongsTo(User, {
  foreignKey: "idUser",
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Modelos sincronizados con la base de datos.");
  })
  .catch((err) => {
    console.error("Error al sincronizar modelos:", err);
  });

module.exports = Product;
