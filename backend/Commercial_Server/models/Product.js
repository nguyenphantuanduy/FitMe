const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Product = sequelize.define(
  "Product",
  {
    seller_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
    },

    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    front_img_path: {
      type: DataTypes.TEXT,
    },

    back_img_path: {
      type: DataTypes.TEXT,
    },

    type: {
      type: DataTypes.ENUM("tops", "bottoms", "one-pieces"),
      allowNull: false,
    },

    sell_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "product",
    timestamps: false,
  },
);

module.exports = Product;
