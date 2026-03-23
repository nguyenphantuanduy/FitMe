const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const User = require("./User"); // để reference User

const Seller = sequelize.define(
  "Seller",
  {
    user_uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      references: {
        model: User,
        key: "uuid",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    shop_name: { type: DataTypes.STRING, allowNull: false },
    shop_description: { type: DataTypes.TEXT },
    joined_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "seller",
    timestamps: false,
  },
);

module.exports = Seller;
