const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const User = require("./user.model");

class UserPosts extends Model {}

UserPosts.init(
  {
    idPost: {
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
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
    postImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "UserPosts",
    tableName: "UserPosts",
  }
);

User.hasMany(UserPosts, {
  foreignKey: "idUser",
});

UserPosts.belongsTo(User, {
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

module.exports = UserPosts;
