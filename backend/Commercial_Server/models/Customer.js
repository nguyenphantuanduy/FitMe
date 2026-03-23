const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db"); // chắc chắn đúng đường dẫn tới db.js
const User = require("./User"); // import User nếu dùng reference

const Customer = sequelize.define(
  "Customer",
  {
    user_uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: { model: User, key: "uuid" }, // foreign key
    },
    gender: { type: DataTypes.ENUM("male", "female", "other") },
    birthday: DataTypes.DATE,
  },
  {
    tableName: "customer",
    timestamps: false,
  },
);

module.exports = Customer;
