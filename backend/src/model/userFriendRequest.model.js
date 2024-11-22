const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../connection");
const User = require("../model/user.model");

class UserFriendRequest extends Model {}

UserFriendRequest.init(
  {
    idFriend: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    idSender: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "idUser",
      },
    },
    idReceptor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "idUser",
      },
    },
    isAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "UserFriendRequest",
    tableName: "Friend",
  }
);

User.hasMany(UserFriendRequest, { foreignKey: "idSender", as: "sentRequests" });
User.hasMany(UserFriendRequest, {
  foreignKey: "idReceptor",
  as: "receivedRequests",
});

UserFriendRequest.belongsTo(User, { foreignKey: "idSender", as: "sender" });
UserFriendRequest.belongsTo(User, { foreignKey: "idReceptor", as: "receptor" });

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Modelos sincronizados con la base de datos.");
  })
  .catch((err) => {
    console.error("Error al sincronizar modelos:", err);
  });

module.exports = UserFriendRequest;
