const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db"); // chắc chắn đúng đường dẫn tới db.js

const User = sequelize.define(
  "User",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.TEXT,
    phone_number: DataTypes.STRING,
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "users",
    timestamps: false,
  },
);

module.exports = User;
