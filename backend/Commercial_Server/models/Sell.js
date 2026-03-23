// models/Sell.js
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Seller = require("./Seller");
const Product = require("./Product");

const Sell = sequelize.define(
  "Sell",
  {
    seller_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Seller, key: "user_uuid" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      primaryKey: true, // đánh dấu primary key
    },
    product_uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Product, key: "uuid" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      primaryKey: true, // kết hợp với seller_uuid thành composite key
    },
    sell_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "sell",
    timestamps: false,
  },
);

// Quan hệ
Seller.hasMany(Sell, { foreignKey: "seller_uuid" });
Sell.belongsTo(Seller, { foreignKey: "seller_uuid" });

Product.hasMany(Sell, { foreignKey: "product_uuid" });
Sell.belongsTo(Product, { foreignKey: "product_uuid" });

module.exports = Sell;
