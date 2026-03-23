const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Product = sequelize.define(
  "Product",
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    img_path: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM("tops", "bottoms", "one-pieces"),
      allowNull: false,
    },
  },
  {
    tableName: "product",
    timestamps: false,
  },
);

module.exports = Product;
