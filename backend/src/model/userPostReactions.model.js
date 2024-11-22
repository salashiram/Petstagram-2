const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const User = require("../model/user.model");
const UserPosts = require("../model/userPosts.model");

class UserPostReactions extends Model {}

UserPostReactions.init(
  {
    idReaction: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idPost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserPosts,
        key: "idPost",
      },
    },
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "idUser",
      },
    },
  },
  {
    sequelize,
    modelName: "UserPostReactions",
    tableName: "UserPostsReactions",
  }
);

UserPosts.hasMany(UserPostReactions, {
  foreignKey: "idReaction",
});

UserPostReactions.belongsTo(UserPosts, {
  foreignKey: "idReaction",
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Modelos sincronizados con la base de datos.");
  })
  .catch((err) => {
    console.error("Error al sincronizar modelos:", err);
  });

module.exports = UserPostReactions;
