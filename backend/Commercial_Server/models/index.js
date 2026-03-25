const Seller = require("./Seller");
const Product = require("./Product");

// Seller có nhiều Product
Seller.hasMany(Product, {
  foreignKey: "seller_uuid",
  sourceKey: "user_uuid",
  onDelete: "CASCADE",
});

// Product thuộc về Seller
Product.belongsTo(Seller, {
  foreignKey: "seller_uuid",
  targetKey: "user_uuid",
});

module.exports = { Seller, Product };
